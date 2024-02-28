import axios from "axios";
import { StockPrice } from "../entity/StockPrice.entity";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { ScheduledTask, schedule } from "node-cron";
import * as _ from "lodash";
import { StockAPIService } from "./stockAPI.service";

export class StockPriceService {
  static scheduledTask: ScheduledTask | null = null;
  static checkedSymbols: string[] = [];

  static async getStockInfo(req: Request, res: Response) {
    const { symbol } = req.params;

    try {
      const currentStockPrice = await StockAPIService.getStockPrice(symbol);

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
    } catch (error) {
      throw new Error(`Error getting stock info: ${error}`);
    }
  }

  static async startPeriodicChecksForSymbol(req: Request, res: Response) {
    const { symbol } = req.params;

    if (StockPriceService.checkedSymbols.includes(symbol)) {
      _.remove(StockPriceService.checkedSymbols, (s) => s === symbol);
      return res.status(200).json({
        message: `Stock price checker for ${symbol} stopped successfully`,
      });
    }

    try {
      if (!(await StockAPIService.getStockPrice(symbol))) {
        return res.status(404).json({
          message: `Error when try to get price for symbol: ${symbol}. Check whether you entered a correct symbol.`,
        });
      }
      StockPriceService.checkedSymbols.push(symbol);

      if (StockPriceService.checkedSymbols.length === 1) {
        StockPriceService.startCheckingCronJob();
      }

      return res.status(200).json({
        message: `Stock price checker for ${symbol} started successfully`,
      });
    } catch (error: any) {
      throw new Error(`Error starting periodic checks: ${error}`);
    }
  }

  private static async startCheckingCronJob() {
    console.log("Checking cron job started");
    StockPriceService.scheduledTask = schedule("* * * * *", async () => {
      try {
        if (StockPriceService.checkedSymbols.length === 0) {
          StockPriceService.scheduledTask?.stop();
          console.log("Checking cron job stopped");
          return;
        }
        console.log("checked symbols", StockPriceService.checkedSymbols);
        await Promise.all(
          StockPriceService.checkedSymbols.map(
            async (cs) => await StockPriceService.startPeriodicCheck(cs)
          )
        );
      } catch (error) {
        throw new Error(`Error in cron job: ${error}`);
      }
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
      throw new Error(`Error on saving stock price with symbol: ${symbol}`);
    }
  }

  private static async startPeriodicCheck(symbol: string) {
    const price = await StockAPIService.getStockPrice(symbol);
    if (price !== null) {
      console.log(`Current price of ${symbol}: ${price}`);
      await StockPriceService.createStockPrice(symbol, price);
    } else {
      throw new Error(`Symbol: ${symbol} not found`);
    }
  }
}
