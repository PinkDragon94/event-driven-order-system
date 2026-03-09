import { publishOrderEvent } from "../events/orderEvents";
import { Order, OrderItem, OrderModel, OrderStatus } from "../models/orderModel";

interface CreateOrderInput {
  customerName: string;
  items: OrderItem[];
}

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.FAILED],
  [OrderStatus.PROCESSING]: [OrderStatus.PAID, OrderStatus.FAILED],
  [OrderStatus.PAID]: [OrderStatus.COMPLETED, OrderStatus.FAILED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.FAILED]: []
};

const calculateTotalAmount = (items: OrderItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity * item.price, 0);

export const createOrder = async (input: CreateOrderInput): Promise<Order> => {
  const totalAmount = calculateTotalAmount(input.items);

  const order = await OrderModel.create({
    customerName: input.customerName,
    items: input.items,
    totalAmount,
    status: OrderStatus.PENDING
  });

  publishOrderEvent("order.created", {
    orderId: order.orderId,
    status: order.status,
    totalAmount: order.totalAmount
  });

  return order.toObject();
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  return OrderModel.findOne({ orderId: id }).lean();
};

export const listOrders = async (): Promise<Order[]> => {
  return OrderModel.find().sort({ createdAt: -1 }).lean();
};

export const updateOrderStatus = async (id: string, nextStatus: OrderStatus): Promise<Order | null> => {
  const order = await OrderModel.findOne({ orderId: id });
  if (!order) {
    return null;
  }

  const currentStatus = order.status;
  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new Error(`Invalid status transition: ${currentStatus} -> ${nextStatus}`);
  }

  order.status = nextStatus;
  await order.save();

  publishOrderEvent("order.status.updated", {
    orderId: order.orderId,
    previousStatus: currentStatus,
    status: order.status
  });

  return order.toObject();
};
