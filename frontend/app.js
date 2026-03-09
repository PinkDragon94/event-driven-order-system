const API_ORIGIN = window.location.port === "3000" ? "" : "http://localhost:3000";
const API_BASE = `${API_ORIGIN}/api/orders`;

const createForm = document.getElementById("create-order-form");
const itemsContainer = document.getElementById("items-container");
const createMessage = document.getElementById("create-message");
const ordersList = document.getElementById("orders-list");
const refreshOrdersBtn = document.getElementById("refresh-orders");
const fetchOrderForm = document.getElementById("fetch-order-form");
const orderIdInput = document.getElementById("order-id-input");
const orderDetails = document.getElementById("order-details");
const statusForm = document.getElementById("status-form");
const statusOrderId = document.getElementById("status-order-id");
const statusSelect = document.getElementById("status-select");
const statusMessage = document.getElementById("status-message");
const addItemBtn = document.getElementById("add-item");

const createItemRow = (item = { name: "", quantity: 1, price: 0 }) => {
  const row = document.createElement("div");
  row.className = "item-row";
  row.innerHTML = `
    <input type="text" placeholder="Item name" class="item-name" value="${item.name}" required />
    <input type="number" placeholder="Qty" class="item-qty" min="1" value="${item.quantity}" required />
    <input type="number" placeholder="Price" class="item-price" min="0" step="0.01" value="${item.price}" required />
    <button type="button" class="remove-item">X</button>
  `;

  row.querySelector(".remove-item").addEventListener("click", () => {
    row.remove();
  });

  itemsContainer.appendChild(row);
};

const parseItems = () => {
  const rows = Array.from(itemsContainer.querySelectorAll(".item-row"));
  return rows.map((row) => ({
    name: row.querySelector(".item-name").value.trim(),
    quantity: Number(row.querySelector(".item-qty").value),
    price: Number(row.querySelector(".item-price").value)
  }));
};

const setMessage = (element, message, isError = false) => {
  element.textContent = message;
  element.style.color = isError ? "var(--danger)" : "var(--accent-warm)";
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

const renderOrders = (orders) => {
  if (!orders.length) {
    ordersList.innerHTML = "<p class='order-meta'>No orders yet.</p>";
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
      <article class="order-card">
        <h3>${order.customerName}</h3>
        <p class="order-meta">ID: ${order.orderId}</p>
        <p class="order-meta">Status: ${order.status}</p>
        <p class="order-meta">Total: $${Number(order.totalAmount).toFixed(2)}</p>
        <button type="button" data-order-id="${order.orderId}" class="view-order">View</button>
      </article>
    `
    )
    .join("");

  ordersList.querySelectorAll(".view-order").forEach((button) => {
    button.addEventListener("click", async () => {
      const orderId = button.getAttribute("data-order-id");
      if (!orderId) {
        return;
      }
      orderIdInput.value = orderId;
      statusOrderId.value = orderId;
      await loadOrderDetails(orderId);
    });
  });
};

const loadOrders = async () => {
  try {
    const orders = await fetchJson(API_BASE);
    renderOrders(orders);
  } catch (error) {
    ordersList.innerHTML = `<p class="order-meta">${error.message}</p>`;
  }
};

const loadOrderDetails = async (orderId) => {
  try {
    const order = await fetchJson(`${API_BASE}/${orderId}`);
    orderDetails.textContent = JSON.stringify(order, null, 2);
  } catch (error) {
    orderDetails.textContent = error.message;
  }
};

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const customerName = document.getElementById("customer-name").value.trim();
  const items = parseItems().filter((item) => item.name && item.quantity > 0 && item.price >= 0);

  if (!customerName || !items.length) {
    setMessage(createMessage, "Customer and at least one valid item are required.", true);
    return;
  }

  try {
    const order = await fetchJson(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerName, items })
    });

    setMessage(createMessage, `Order created: ${order.orderId}`);
    createForm.reset();
    itemsContainer.innerHTML = "";
    createItemRow();
    await loadOrders();
  } catch (error) {
    setMessage(createMessage, error.message, true);
  }
});

fetchOrderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await loadOrderDetails(orderIdInput.value.trim());
});

statusForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const orderId = statusOrderId.value.trim();
  const status = statusSelect.value;

  if (!orderId || !status) {
    setMessage(statusMessage, "Order ID and status are required.", true);
    return;
  }

  try {
    await fetchJson(`${API_BASE}/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setMessage(statusMessage, `Order ${orderId} updated to ${status}`);
    await loadOrders();
    await loadOrderDetails(orderId);
  } catch (error) {
    setMessage(statusMessage, error.message, true);
  }
});

refreshOrdersBtn.addEventListener("click", loadOrders);
addItemBtn.addEventListener("click", () => createItemRow());

createItemRow();
loadOrders();
