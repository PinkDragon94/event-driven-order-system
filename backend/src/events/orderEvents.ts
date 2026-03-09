import { EventEmitter } from "events";

type OrderEventPayload = Record<string, unknown>;

class OrderEventBus extends EventEmitter {
  publish(eventName: string, payload: OrderEventPayload): void {
    this.emit(eventName, payload);
  }
}

export const orderEventBus = new OrderEventBus();

export const publishOrderEvent = (eventName: string, payload: OrderEventPayload): void => {
  orderEventBus.publish(eventName, payload);
  // Placeholder for Redis/BullMQ publisher integration.
  if (process.env.NODE_ENV !== "test") {
    console.info(`[event] ${eventName}`, payload);
  }
};
