const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "food_microservice",
  password: "vikram123",
  port: 5432
});

module.exports = pool;