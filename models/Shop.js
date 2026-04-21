import mongoose from "mongoose";
const shopSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },

  ownerName: String,
  phone: String,
  email: String,

  shopName: { type: String, required: true },

  category: {
    type: String,
    enum: ["salon", "home", "consultation"],
    required: true
  },

  location: String,

  shopImage: String, // ✅ ADD THIS

services: [
  {
    id: String, // 🔥 ADD THIS
    name: String,
    price: Number,
    dur: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  }
],

  weeklySchedule: {
    Monday: [String],
    Tuesday: [String],
    Wednesday: [String],
    Thursday: [String],
    Friday: [String],
    Saturday: [String],
    Sunday: [String]
  }

}, { timestamps: true });
export default mongoose.model("Shop", shopSchema);