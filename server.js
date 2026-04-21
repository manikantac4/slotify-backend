import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});
import express from "express";
import cors from "cors";

const app = express();

// ✅ CORS FIRST
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://slotify-work.vercel.app"
  ],
  credentials: true
}));

// ✅ THEN JSON
app.use(express.json());

// ✅ THEN ROUTES
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});