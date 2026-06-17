const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || "http://notification-service:5005";

app.post("/orders", async (req, res) => {
  try {
    const { userId, restaurantId, items, totalAmount } = req.body;

    const result = await pool.query(
      "INSERT INTO orders(user_id, restaurant_id, items, total_amount, status) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [userId, restaurantId, items, totalAmount, "Placed"]
    );

    const order = result.rows[0];

    await axios.post(`${NOTIFICATION_SERVICE}/notify`, {
      orderId: order.id,
      message: `Order ${order.id} placed successfully`
    }, { timeout: 5000 });

    res.json({
      message: "Order placed successfully",
      order
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );

    res.json({
      message: "Order status updated",
      order: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5003, () => {
  console.log("Order Service running on port 5003");
});