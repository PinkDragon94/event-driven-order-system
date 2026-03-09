import { Router } from "express";
import {
  createOrderHandler,
  getOrderByIdHandler,
  listOrdersHandler,
  updateOrderStatusHandler
} from "../controllers/orderController";

const orderRouter = Router();

orderRouter.post("/", createOrderHandler);
orderRouter.get("/", listOrdersHandler);
orderRouter.get("/:id", getOrderByIdHandler);
orderRouter.patch("/:id/status", updateOrderStatusHandler);

export default orderRouter;
