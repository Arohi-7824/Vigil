const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authMiddleware = require("../middleware/authMiddleware");

const {
  createRisk,
  getRisks,
  resolveRisk,
  assignTeam
} = require("../controllers/riskController");

/* CREATE */
router.post(
  "/",
  authMiddleware.requireAuth,
  upload.single("image"),
  createRisk
);

/* READ */
router.get("/", getRisks);

/* ALERTS */
router.get("/alerts", authMiddleware.requireAuth, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM alerts 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [req.user.id]
  );

  res.json(result.rows);
});

/* UPDATE */
router.put("/:id/resolve", authMiddleware.requireAuth, resolveRisk);

router.put("/:id/assign", authMiddleware.requireAuth, assignTeam);

module.exports = router;