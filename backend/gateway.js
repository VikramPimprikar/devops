const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5001/register", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:5001/login", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(401).json({ message: "Invalid login" });
  }
});

app.get("/api/restaurants", async (req, res) => {
  const response = await axios.get("http://localhost:5002/restaurants");
  res.json(response.data);
});

app.post("/api/orders", async (req, res) => {
  const response = await axios.post("http://localhost:5003/orders", req.body);
  res.json(response.data);
});

app.get("/api/orders", async (req, res) => {
  const response = await axios.get("http://localhost:5003/orders");
  res.json(response.data);
});

app.post("/api/payment", async (req, res) => {
  const response = await axios.post("http://localhost:5004/payment", req.body);
  res.json(response.data);
});

app.get("/api/notifications", async (req, res) => {
  const response = await axios.get("http://localhost:5005/notifications");
  res.json(response.data);
});

app.listen(5000, () => {
  console.log("API Gateway running on port 5000");
});