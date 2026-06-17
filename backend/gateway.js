const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const USER_SERVICE = process.env.USER_SERVICE || "http://user-service:5001";
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE || "http://restaurant-service:5002";
const ORDER_SERVICE = process.env.ORDER_SERVICE || "http://order-service:5003";
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE || "http://payment-service:5004";
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || "http://notification-service:5005";

const proxy = async (res, requestFn, fallbackStatus = 500) => {
  try {
    const response = await requestFn();
    res.status(response.status || 200).json(response.data);
  } catch (err) {
    const status = err.response?.status || fallbackStatus;
    const message = err.response?.data?.message || err.response?.data?.error || err.message || "Gateway error";
    res.status(status).json({ message });
  }
};

app.post("/api/register", async (req, res) => {
  await proxy(res, () => axios.post(`${USER_SERVICE}/register`, req.body, { timeout: 8000 }));
});

app.post("/api/login", async (req, res) => {
  await proxy(res, () => axios.post(`${USER_SERVICE}/login`, req.body, { timeout: 8000 }), 401);
});

app.get("/api/restaurants", async (req, res) => {
  await proxy(res, () => axios.get(`${RESTAURANT_SERVICE}/restaurants`, { timeout: 8000 }));
});

app.post("/api/orders", async (req, res) => {
  await proxy(res, () => axios.post(`${ORDER_SERVICE}/orders`, req.body, { timeout: 8000 }));
});

app.get("/api/orders", async (req, res) => {
  await proxy(res, () => axios.get(`${ORDER_SERVICE}/orders`, { timeout: 8000 }));
});

app.post("/api/payment", async (req, res) => {
  await proxy(res, () => axios.post(`${PAYMENT_SERVICE}/payment`, req.body, { timeout: 8000 }));
});

app.get("/api/notifications", async (req, res) => {
  await proxy(res, () => axios.get(`${NOTIFICATION_SERVICE}/notifications`, { timeout: 8000 }));
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});