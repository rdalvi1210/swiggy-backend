import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  address: { type: String, default: "" }, // ← default empty
  role: { type: String, default: "user" },
});

export default mongoose.model("User", userSchema);
