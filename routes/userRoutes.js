import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🔥 CREATE USER (from Firebase signup)
router.post("/create", async (req, res) => {
  try {
    const { uid, name, email, role } = req.body;

    // check if already exists
    const existingUser = await User.findOne({ firebaseUID: uid });
    if (existingUser) {
      return res.json(existingUser);
    }

    const newUser = await User.create({
      firebaseUID: uid,
      name,
      email,
      role
    });

    res.status(201).json(newUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});
// 🔥 GET USER BY UID (for prefill)
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.params.uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
});
export default router;