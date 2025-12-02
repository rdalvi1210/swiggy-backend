import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  pincode: String,
  fullAddress: String,
  label: { type: String, default: "Home" }, // Home / Work / Other
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  addresses: { type: [addressSchema], default: [] }, // multiple addresses
  role: { type: String, default: "user" },
});

export default mongoose.model("User", userSchema);
