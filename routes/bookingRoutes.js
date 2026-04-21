import express from "express";
import Booking from "../models/Booking.js";
import Shop from "../models/Shop.js";

const router = express.Router();

// 🔥 CREATE BOOKING
router.post("/create", async (req, res) => {
  try {
    const { ownerId, date, time } = req.body;

    // 1️⃣ Get shop
    const shop = await Shop.findOne({ ownerId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // 2️⃣ Get day name
    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "long"
    });

    const slots = shop.weeklySchedule[dayName] || [];

    // 3️⃣ Check slot exists
    if (!slots.includes(time)) {
      return res.status(400).json({
        message: "Invalid slot (not in schedule)"
      });
    }

    // 4️⃣ Prevent double booking
    const exists = await Booking.findOne({
      ownerId,
      date,
      time
    });

    if (exists) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    // 5️⃣ CREATE BOOKING (🔥 UPDATED)
    const booking = await Booking.create({
      ...req.body,
      shopName: shop.shopName   // ✅ FIXED
    });

    res.status(201).json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking" });
  }
});





// 🔥 GET USER BOOKINGS
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.params.userId
    }).sort({ date: -1 });

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});
// 🔥 GET BOOKINGS BY SHOP + DATE
router.get("/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { date } = req.query;

    const bookings = await Booking.find({
      ownerId,
      date
    });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
export default router;