const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { q, lat, lon } = req.query;

    const params = {
      format: "json",
      q,
      addressdetails: 1,
      limit: 5,
      countrycodes: "in"
    };

    // 🔥 Bias results near user
    if (lat && lon && lat !== "undefined" && lon !== "undefined") {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (!isNaN(latNum) && !isNaN(lonNum)) {
    params.viewbox = `${lonNum - 0.5},${latNum - 0.5},${lonNum + 0.5},${latNum + 0.5}`;
    params.bounded = 1;
  }
}

    // ✅ THIS WAS MISSING
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params,
        headers: {
          "User-Agent": "risk-app"
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    console.error("Geocode error:", err.message);
    res.status(500).json({ error: "Geocode failed" });
  }
});

module.exports = router;