import express from "express";
import Shop from "../models/Shop.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// 🔥 DASHBOARD API (5 DAYS SUPPORT)
router.get("/:uid", async (req, res) => {
  try {
    const { dayIndex = 0 } = req.query; // 0 = today, 1 = tomorrow...

    // 1️⃣ Get shop
    const shop = await Shop.findOne({ ownerId: req.params.uid });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // 2️⃣ Calculate selected date
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + Number(dayIndex));

    const date = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD

    const dayName = dateObj.toLocaleDateString("en-US", {
      weekday: "long"
    });

    // 3️⃣ Get slots for that day
    const slots = shop.weeklySchedule[dayName] || [];

    // 4️⃣ Get bookings for that day
    const bookings = await Booking.find({
      shopId: req.params.uid,
      date
    });

    // 5️⃣ Convert slots → state
    const finalSlots = slots.map(time => {
      const isBooked = bookings.some(b => b.time === time);

      return {
        time,
        state: isBooked ? "booked" : "available"
      };
    });

    // 6️⃣ Format bookings (only needed fields)
    const formattedBookings = bookings.map(b => ({
      name: b.userName,
      phone: b.phone,
      service: b.service.name,
      time: b.time,
      status: b.status
    }));

    // 7️⃣ Send response
    res.json({
      date,
      dayName,

      shop: {
        shopName: shop.shopName,
        ownerName: shop.ownerName,
        email: shop.email,
        phone: shop.phone,
        location: shop.location
      },

      bookings: formattedBookings,
      slots: finalSlots
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
});
// 🔥 GET BOOKINGS BY SHOP + DATE
router.get("/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;
    const { date } = req.query;

    const bookings = await Booking.find({
      shopId,
      date
    });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
export default router;