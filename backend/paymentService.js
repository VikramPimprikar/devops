const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/payment", async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;

    const payment = await pool.query(
      "INSERT INTO payments(order_id, amount, method, status) VALUES($1, $2, $3, $4) RETURNING *",
      [orderId, amount, method, "Success"]
    );

    await pool.query(
      "UPDATE orders SET status=$1 WHERE id=$2",
      ["Paid", orderId]
    );

    res.json({
      message: "Payment successful",
      payment: payment.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/payments", async (req, res) => {
  const result = await pool.query("SELECT * FROM payments");
  res.json(result.rows);
});

app.listen(5004, () => {
  console.log("Payment Service running on port 5004");
});