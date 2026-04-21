import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  email: String,
  role: {
    type: String,
    enum: ["user", "provider"]
  }
});

export default mongoose.model("User", userSchema);