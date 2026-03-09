import { NextFunction, Request, Response } from "express";
import { OrderItem, OrderStatus } from "../models/orderModel";
import { createOrder, getOrderById, listOrders, updateOrderStatus } from "../services/orderService";

const statusValues = Object.values(OrderStatus);

export const createOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customerName, items } = req.body as { customerName?: string; items?: unknown[] };

    if (!customerName || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "customerName and items are required" });
      return;
    }

    const normalizedItems = items as OrderItem[];
    const order = await createOrder({ customerName, items: normalizedItems });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orderId = typeof req.params.id === "string" ? req.params.id : "";
    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const listOrdersHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await listOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body as { status?: OrderStatus };
    if (!status || !statusValues.includes(status)) {
      res.status(400).json({ message: `status must be one of: ${statusValues.join(", ")}` });
      return;
    }

    const orderId = typeof req.params.id === "string" ? req.params.id : "";
    const order = await updateOrderStatus(orderId, status);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
