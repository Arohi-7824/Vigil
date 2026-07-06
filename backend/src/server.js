require('dotenv').config();
const app = require('./app');
const riskRoutes = require("./routes/riskRoutes");

app.use("/risks", riskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});