import express from "express";
import User from "../models/User.js";
import Shop from "../models/Shop.js";

const router = express.Router();

// GET PROFILE
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.uid });
    const shop = await Shop.findOne({ ownerId: req.params.uid });

    res.json({ user, shop });

  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPDATE PROFILE
router.put("/:uid", async (req, res) => {
  try {
    const updatedShop = await Shop.findOneAndUpdate(
      { ownerId: req.params.uid },
      req.body,
      { new: true }
    );

    res.json(updatedShop);

  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;