const express = require("express");
const cors = require("cors");

const deviceRoutes = require("./routes/devices");
const sensorRoutes = require("./routes/sensors");
const alertRoutes = require("./routes/alert");
const analyticsRoutes = require("./routes/analytics");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

app.use("/api/devices", deviceRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes); // 
app.use("/api/analytics", analyticsRoutes);

module.exports = app;