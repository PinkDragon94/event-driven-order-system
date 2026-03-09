const request = require("supertest");

jest.mock("../dist/services/orderService.js", () => ({
  createOrder: jest.fn(),
  getOrderById: jest.fn(),
  listOrders: jest.fn(),
  updateOrderStatus: jest.fn()
}));

const orderService = require("../dist/services/orderService.js");
const app = require("../dist/app.js").default;

describe("API smoke tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /health returns ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("POST /api/orders validates required fields", async () => {
    const response = await request(app).post("/api/orders").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("customerName and items are required");
  });

  test("POST /api/orders creates an order", async () => {
    orderService.createOrder.mockResolvedValue({
      orderId: "ord-123",
      customerName: "Jane Doe",
      items: [{ name: "Keyboard", quantity: 1, price: 79.99 }],
      totalAmount: 79.99,
      status: "PENDING"
    });

    const response = await request(app).post("/api/orders").send({
      customerName: "Jane Doe",
      items: [{ name: "Keyboard", quantity: 1, price: 79.99 }]
    });

    expect(response.status).toBe(201);
    expect(response.body.orderId).toBe("ord-123");
    expect(orderService.createOrder).toHaveBeenCalledTimes(1);
  });
});
