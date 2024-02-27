import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { StockPrice } from "../entity/StockPrice.entity";

export class StockPriceController {
  static async getAllStockPrices(req: Request, res: Response) {
    const stockPriceRepository = AppDataSource.getRepository(StockPrice);
    const stockPrices = await stockPriceRepository.find();
    return res.status(200).json({
      data: stockPrices,
    });
  }

  static async createStockPrice(req: Request, res: Response) {
    const { price, symbol } = req.body;
    const stockPrice = new StockPrice();
    stockPrice.symbol = symbol;
    stockPrice.price = price;
    const stockPriceRepository = AppDataSource.getRepository(StockPrice);
    await stockPriceRepository.save(stockPrice);
    return res
      .status(200)
      .json({ message: "Stock price created successfully", stockPrice });
  }
}
