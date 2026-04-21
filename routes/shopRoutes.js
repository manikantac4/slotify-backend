import express from "express";
import Shop from "../models/Shop.js";
import upload from "../middleware/upload.js";

const router = express.Router();


// 🔥 CREATE SHOP
router.post("/create", upload.single("shopImage"), async (req, res) => {
  try {
    const {
      ownerId,
      ownerName,
      phone,
      email,
      shopName,
      category,
      location,
      services,
      weeklySchedule
    } = req.body;

    const imageUrl = req.file?.path;

    // 🔥 ADD THIS
    const servicesParsed = JSON.parse(services);
    const scheduleParsed = JSON.parse(weeklySchedule);

    const existing = await Shop.findOne({ ownerId });
    if (existing) {
      return res.status(400).json({ message: "Shop already exists" });
    }

    const shop = await Shop.create({
      ownerId,
      ownerName,
      phone,
      email,
      shopName,
      category,
      location,
      services: servicesParsed,         // ✅ FIXED
      weeklySchedule: scheduleParsed,   // ✅ FIXED
      shopImage: imageUrl
    });

    res.status(201).json(shop);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating shop" });
  }
});

// 🔥 GET MY SHOP
router.get("/my-shop/:uid", async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.params.uid });
    res.json(shop);
  } catch (err) {
    res.status(500).json(err);
  }
});// 🔥 GET SLOTS + SERVICES FOR DASHBOARD
router.get("/slots/:uid", async (req, res) => {
  try {
    const { dayIndex = 0 } = req.query;

    // 1️⃣ Get shop
    const shop = await Shop.findOne({ ownerId: req.params.uid });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // 2️⃣ Calculate date
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + Number(dayIndex));

    const dayName = dateObj.toLocaleDateString("en-US", {
      weekday: "long"
    });

    // 3️⃣ Get slots for that day
    const slots = shop.weeklySchedule[dayName] || [];

    // 4️⃣ Send response
    res.json({
  date: dateObj.toISOString().split("T")[0],
  dayName,

  // 🔥 ADD THIS
  shop: {
    shopName: shop.shopName,
    location: shop.location,
    shopImage: shop.shopImage,
    category: shop.category
  },

  slots,
  totalSlots: slots.length,

  services: shop.services.map(s => ({
    name: s.name,
    price: s.price,
    duration: s.dur
  }))
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching slots" });
  }
});
// 🔥 GET ALL SHOPS (FOR USER DASHBOARD)
router.get("/all", async (req, res) => {
  try {
    const shops = await Shop.find();

    res.json(shops);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching shops" });
  }
});
export default router;