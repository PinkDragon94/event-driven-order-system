# Event-Driven Order Processing System

A backend service that handles order processing using a modular, event-driven architecture. Designed for scalability and maintainability, this project demonstrates API design, service separation, database modeling, and production-ready backend practices.

## Features
- **Order Management API**  
  - Create orders (`POST /api/orders`)  
  - Retrieve order details (`GET /api/orders/:id`)  
  - List all orders (`GET /api/orders`)  
  - Update order status (`PATCH /api/orders/:id/status`)  

- **Database Layer**  
  - MongoDB schema for orders and items  
  - UUID-based order IDs  
  - Lifecycle states: `PENDING`, `PROCESSING`, `PAID`, `COMPLETED`, `FAILED`  

- **Middleware**  
  - Logging requests and responses  
  - Error handling  
  - Security headers via `helmet`  
  - CORS support  

- **Event-Driven Ready**  
  - Placeholder for publishing `order.created` and other lifecycle events  
  - Designed to integrate Redis/BullMQ or other message brokers  

## Tech Stack

- **Backend:** Node.js, Express, TypeScript  
- **Database:** MongoDB  
- **Queue (future phase):** Redis + BullMQ  
- **Dev Tools:** ESLint, Prettier, Jest, ts-node-dev 

## Setup

1. Install dependencies:
   `npm install`
2. Create `.env` with:
   - `MONGO_URI=mongodb://localhost:27017/order-system`
   - `PORT=3000`
   - `CORS_ORIGIN=*`
   - `START_WITHOUT_DB=false` (set to `true` for API-only boot when Mongo is offline)
3. Run development server:
   `npm run dev`

## Commands

- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test`

## API Examples

- Create order:
  `POST /api/orders`
  ```json
  {
    "customerName": "Jane Doe",
    "items": [
      { "name": "Keyboard", "quantity": 1, "price": 79.99 },
      { "name": "Mouse", "quantity": 1, "price": 39.99 }
    ]
  }
  ```
- Update order status:
  `PATCH /api/orders/:id/status`
  ```json
  {
    "status": "PROCESSING"
  }
  ```
