const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_URL
});

pool.connect()
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.error("❌ DB connection error:", err.message));

module.exports = pool;