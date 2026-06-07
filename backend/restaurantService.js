const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await pool.query("SELECT * FROM restaurants");

    for (let r of restaurants.rows) {
      const menu = await pool.query(
        "SELECT * FROM menu_items WHERE restaurant_id=$1",
        [r.id]
      );

      r.menu = menu.rows;
    }

    res.json(restaurants.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/restaurants", async (req, res) => {
  try {
    const { name, location } = req.body;

    await pool.query(
      "INSERT INTO restaurants(name, location) VALUES($1, $2)",
      [name, location]
    );

    res.json({ message: "Restaurant added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5002, () => {
  console.log("Restaurant Service running on port 5002");
});