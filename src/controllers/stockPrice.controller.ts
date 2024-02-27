import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { StockPrice } from "../entity/StockPrice.entity";
import { getStockPrice } from "../services/stockPrice-data.service";
import { schedule, ScheduledTask } from "node-cron";
import * as _ from "lodash";

interface SymbolMap {
  [symbol: string]: boolean;
}
export class StockPriceController {
  static scheduledTask: ScheduledTask | null = null;
  static checkedSymbols: SymbolMap = {};

  static async getStockInfo(req: Request, res: Response) {
    const { symbol } = req.params;

    const currentStockPrice = await getStockPrice(symbol);

    const stockPriceRepository = AppDataSource.getRepository(StockPrice);
    const stockPrices = await stockPriceRepository.find({
      where: { symbol },
      order: { updatedAt: "DESC" },
    });

    if (stockPrices.length === 0) {
      return res.status(404).json({
        message: "No stored symbol was found. Try to start watching it.",
      });
    }

    const movingAvg = _.meanBy(stockPrices.slice(0, 10), (sp) => sp.price);
    const lastUpdatedAt = stockPrices[0].updatedAt;

    return res.status(200).json({
      message: {
        symbol: symbol,
        currentStockPrice: currentStockPrice,
        movingAVG: movingAvg,
        lastUpdated: lastUpdatedAt,
      },
    });
  }

  private static async createStockPrice(symbol: string, price: number) {
    try {
      const stockPrice = new StockPrice();
      stockPrice.symbol = symbol;
      stockPrice.price = price;
      const stockPriceRepository = AppDataSource.getRepository(StockPrice);
      await stockPriceRepository.save(stockPrice);
    } catch (error) {
      console.error(`Error on saving stock price with symbol: ${symbol}`);
    }
  }

  private static async startPeriodicCheck(symbol: string) {
    const price = await getStockPrice(symbol);
    if (price !== null) {
      console.log(`Current price of ${symbol}: ${price}`);
      await StockPriceController.createStockPrice(symbol, price);
      StockPriceController.checkedSymbols[symbol] = true;
    } else {
      StockPriceController.stopPeriodicChecks(symbol);
      throw new Error(`Symbol: ${symbol} not found`);
    }
  }

  private static async stopPeriodicChecks(symbol: string) {
    if (StockPriceController.checkedSymbols[symbol]) {
      delete StockPriceController.checkedSymbols[symbol];
      console.log(`Stock price checker for ${symbol} stopped successfully`);
      if (Object.keys(StockPriceController.checkedSymbols).length === 0) {
        StockPriceController.scheduledTask?.stop();
      }
    }
  }

  static async startPeriodicChecks(req: Request, res: Response) {
    const { symbol } = req.params;

    if (StockPriceController.checkedSymbols[symbol]) {
      StockPriceController.stopPeriodicChecks(symbol);
      return res.status(200).json({
        message: `Stock price checker for ${symbol} stopped successfully`,
      });
    }

    try {
      await StockPriceController.startPeriodicCheck(symbol);
      if (!StockPriceController.scheduledTask) {
        StockPriceController.scheduledTask = schedule("* * * * *", async () => {
          try {
            console.log("checked symbols", StockPriceController.checkedSymbols);
            await Promise.all(
              Object.keys(StockPriceController.checkedSymbols).map(
                async (cs) => await StockPriceController.startPeriodicCheck(cs)
              )
            );
          } catch (error) {
            console.error("Error in cron job:", error);
          }
        });
      }
      return res.status(200).json({
        message: `Stock price checker for ${symbol} started successfully`,
      });
    } catch (error: any) {
      console.error("Error starting periodic checks:", error);
      return res.status(404).json({ message: error.message });
    }
  }
}
