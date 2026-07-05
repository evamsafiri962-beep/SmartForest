require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

//dns config
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// CONNECTION LOGIC
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// DB CONNECTION (clean version)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log("Server running on port", PORT);
// });

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});