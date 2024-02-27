import * as express from "express";
import { StockPriceController } from "../controllers/stockPrice.controller";
const Router = express.Router();

Router.get("/:symbol", StockPriceController.getStockInfo);
Router.put("/:symbol", StockPriceController.startPeriodicChecks);
export { Router as stockRouter };
