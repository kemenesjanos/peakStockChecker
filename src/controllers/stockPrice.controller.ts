import { Request, Response } from "express";
import { StockPriceService } from "../services/stockPrice.service";
export class StockPriceController {
  static async getStockInfo(req: Request, res: Response) {
    StockPriceService.getStockInfo(req, res);
  }

  static async startPeriodicChecks(req: Request, res: Response) {
    StockPriceService.startPeriodicChecksForSymbol(req, res);
  }
}
