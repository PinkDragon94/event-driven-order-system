import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";
import { randomUUID } from "crypto";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

const orderItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
      default: randomUUID
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(value: OrderItem[]) => value.length > 0, "At least one item is required"]
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      required: true
    }
  },
  { timestamps: true }
);

export type OrderItem = InferSchemaType<typeof orderItemSchema>;
export type Order = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<Order>;

export const OrderModel = model<Order>("Order", orderSchema);
