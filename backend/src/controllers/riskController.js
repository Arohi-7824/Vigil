const pool = require("../config/db");
const axios = require("axios");

/* -------------------------------------------------- */
/* 🔥 SEVERITY NORMALIZATION */
/* -------------------------------------------------- */
const normalizeSeverity = (score) => {
  if (score >= 85) return "CRITICAL";
  else if (score >= 70) return "HIGH";
  else if (score >= 30) return "MEDIUM";
  else return "LOW";
};

const suggestTeam = (description) => {
  const text = description.toLowerCase();

  if (
    text.includes("fire") ||
    text.includes("smoke") ||
    text.includes("gas")
  ) {
    return "FIRE_RESPONSE_TEAM";
  }

  if (
    text.includes("wire") ||
    text.includes("electric") ||
    text.includes("short circuit")
  ) {
    return "ELECTRICAL_TEAM";
  }

  if (
    text.includes("water") ||
    text.includes("pipe") ||
    text.includes("leak")
  ) {
    return "MAINTENANCE_TEAM";
  }

  if (
    text.includes("crack") ||
    text.includes("bridge") ||
    text.includes("road") ||
    text.includes("pothole")
  ) {
    return "CIVIL_ENGINEERING_TEAM";
  }

  return "GENERAL_RESPONSE_TEAM";
};

/* -------------------------------------------------- */
/* 🆕 CREATE RISK */
/* -------------------------------------------------- */
exports.createRisk = async (req, res) => {
  try {
    const { description, latitude, longitude } = req.body;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const imagePath = req.file ? req.file.path : null; // ✅ correct place
    const userId = req.user?.id || null;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    /* 🚫 Prevent duplicate */
    const duplicate = await pool.query(
      `SELECT * FROM risks 
       WHERE description = $1 
       AND ABS(latitude - $2) < 0.01
       AND ABS(longitude - $3) < 0.01
       AND created_at > NOW() - INTERVAL '10 minutes'
       LIMIT 1`,
      [description, lat, lng]
    );

    if (duplicate.rows.length > 0) {
      return res.status(400).json({
        error: "Similar incident already reported recently"
      });
    }

    /* 🧠 IMAGE + TEXT */
    let imageInsight = "";

    if (imagePath) {
      imageInsight = "Image may contain a hazardous or unsafe condition.";
    }

    /* 🤖 AI CALL */
    const aiResponse = await axios.post("http://localhost:5000/analyze", {
      description: `${description} ${
        imageInsight ? "Image context: " + imageInsight : ""
      }`
    });


    let { risk_score, ai_summary, recommendations } = aiResponse.data;

    /* SAFETY FIXES */
    if (!ai_summary) ai_summary = "No analysis available";

    if (!recommendations) {
      recommendations = ["No recommendations available"];
    }

    if (typeof recommendations === "string") {
      try {
        recommendations = JSON.parse(recommendations);
      } catch {
        recommendations = [recommendations];
      }
    }

    const severity = normalizeSeverity(risk_score || 0);

        const suggestedTeam = suggestTeam(description);

    /* 💾 SAVE TO DB */
    const result = await pool.query(
  `INSERT INTO risks 
  (
    description,
    latitude,
    longitude,
    risk_score,
    severity,
    ai_summary,
    recommendations,
    user_id,
    image,
    assigned_team
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  RETURNING *`,
  [
    description,
    latitude,
    longitude,
    risk_score || 0,
    severity,
    ai_summary,
    JSON.stringify(recommendations),
    userId,
    imagePath,
    suggestedTeam
  ]
);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("CREATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------- */
/* 📥 GET RISKS */
/* -------------------------------------------------- */
exports.getRisks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM risks ORDER BY created_at DESC`
    );

    const fixed = result.rows.map(r => ({
      ...r,
      recommendations:
        typeof r.recommendations === "string"
          ? JSON.parse(r.recommendations || "[]")
          : r.recommendations
    }));

    res.json(fixed);

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------- */
/* 🔄 RESOLVE / REOPEN */
/* -------------------------------------------------- */
exports.resolveRisk = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE risks SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    const risk = result.rows[0];

    /* 🔔 SEND ALERT */
    if (status === "RESOLVED" && risk.user_id) {
      await pool.query(
        `INSERT INTO alerts (user_id, message, risk_id)
         VALUES ($1, $2, $3)`,
        [
          risk.user_id,
          `Your reported issue "${risk.description}" has been resolved.`,
          risk.id
        ]
      );
    }

    res.json(risk);

  } catch (err) {
    console.error("RESOLVE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

exports.assignTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_team } = req.body;

    const result = await pool.query(
      `UPDATE risks
       SET assigned_team = $1,
           status = 'IN_PROGRESS',
           assigned_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [assigned_team, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Assignment failed"
    });
  }
};