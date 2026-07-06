const express = require("express");
const cors = require("cors");

const geocodeRoutes = require("./routes/geocode");
const riskRoutes = require("./routes/riskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/risks", riskRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", riskRoutes);
app.use("/uploads", express.static("src/uploads"));

module.exports = app;