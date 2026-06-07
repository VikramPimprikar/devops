const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/notify", async (req, res) => {
  try {
    const { orderId, message } = req.body;

    await pool.query(
      "INSERT INTO notifications(order_id, message) VALUES($1, $2)",
      [orderId, message]
    );

    console.log("Notification:", message);

    res.json({ message: "Notification saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/notifications", async (req, res) => {
  const result = await pool.query("SELECT * FROM notifications");
  res.json(result.rows);
});

app.listen(5005, () => {
  console.log("Notification Service running on port 5005");
});