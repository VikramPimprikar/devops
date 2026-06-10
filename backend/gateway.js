const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const USER_SERVICE = process.env.USER_SERVICE || "http://localhost:5001";
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE || "http://localhost:5002";
const ORDER_SERVICE = process.env.ORDER_SERVICE || "http://localhost:5003";
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE || "http://localhost:5004";
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || "http://localhost:5005";

app.post("/api/register", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/register`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE}/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(401).json({ message: "Invalid login" });
  }
});

app.get("/api/restaurants", async (req, res) => {
  try {
    const response = await axios.get(`${RESTAURANT_SERVICE}/restaurants`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const response = await axios.post(`${ORDER_SERVICE}/orders`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE}/orders`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/payment", async (req, res) => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE}/payment`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/notifications", async (req, res) => {
  try {
    const response = await axios.get(`${NOTIFICATION_SERVICE}/notifications`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});