import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  ownerId: { type: String, required: true }, // 🔥 shop link
  userId: { type: String, required: true },

  userName: String,
  phone: String,

  shopName: String, // ✅ ADD THIS

  service: {
    name: String,
    price: Number
  },

  date: { type: String, required: true },
  time: { type: String, required: true },

  status: {
    type: String,
    enum: ["confirmed", "pending", "cancelled"],
    default: "confirmed"
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);