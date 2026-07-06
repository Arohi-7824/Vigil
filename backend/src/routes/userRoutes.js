const express = require("express");
const router = express.Router();   // 🔥 THIS WAS MISSING

const pool = require("../config/db");

// 🔥 GET USER ROLE
router.get("/role", async (req, res) => {
  try {
    const { email } = req.query;

    console.log("EMAIL RECEIVED:", email);

    const result = await pool.query(
      "SELECT role FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    console.log("DB RESULT:", result.rows);

    if (result.rows.length === 0) {
      return res.json({ role: "USER" });
    }

    res.json({ role: result.rows[0].role });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch role" });
  }
});

module.exports = router;