import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import FoodStore from "../models/foodstore.model.js";
import Grocery from "../models/groceries.model.js";
import Restaurant from "../models/restaurants.model.js";
import Seller from "../models/seller.model.js";
import User from "../models/user.model.js";

// =====================================================
// USER REGISTER
// =====================================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashed });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// =====================================================
// LOGIN (USER + SELLER)
// =====================================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });

    let account = await User.findOne({ email });
    let accountType = "user";

    // Try seller if no user
    if (!account) {
      account = await Seller.findOne({ email });
      accountType = "seller";
    }

    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found." });

    const match = await bcrypt.compare(password, account.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const cookieName = accountType === "user" ? "token" : "seller_token";

    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accountType,
      data: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: account.role,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

// =====================================================
// GET CURRENT ACCOUNT (USER or SELLER)
// =====================================================
export const getCurrentUser = async (req, res) => {
  try {
    const { id, role } = req.user;

    const model = role === "user" ? User : Seller;

    const account = await model.findById(id).select("-password");
    if (!account)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });

    return res.status(200).json({ success: true, accountType: role, account });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =====================================================
// LOGOUT
// =====================================================
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("seller_token");
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
};

// =====================================================
// REGISTER SELLER (restaurant / food / grocery)
// =====================================================
export const registerSeller = async (req, res) => {
  try {
    const { ownerName, email, password, sellerType } = req.body;

    if (!ownerName || !email || !password || !sellerType) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (!["restaurant", "food", "grocery"].includes(sellerType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sellerType." });
    }

    const exist = await Seller.findOne({ email });
    if (exist) {
      return res
        .status(409)
        .json({ success: false, message: "Seller already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      ownerName,
      email,
      password: hashed,
      sellerType,
    });

    let details;

    // ======================================
    // RESTAURANT
    // ======================================
    if (sellerType === "restaurant") {
      details = await Restaurant.create({
        sellerId: seller._id,
        businessName: "",
        address: "",
        cuisines: [],
        deliveryTime: "",
        openingTime: "",
        closingTime: "",
        coverImage: "",
        menuItems: [],
      });
    }

    // ======================================
    // FOOD STORE
    // ======================================
    if (sellerType === "food") {
      details = await FoodStore.create({
        sellerId: seller._id,
        storeName: "",
        address: "",
        cuisines: [],
        deliveryTime: "",
        openingTime: "",
        closingTime: "",
        coverImage: "",
        productList: [],
      });
    }

    // ======================================
    // GROCERY
    // ======================================
    if (sellerType === "grocery") {
      details = await Grocery.create({
        sellerId: seller._id,
        storeName: "",
        address: "",
        warehouseLocation: "",
        deliveryTime: "",
        inventory: [],
      });
    }

    seller.sellerTypeId = details._id;
    await seller.save();

    return res.status(201).json({
      success: true,
      message: "Seller registered successfully.",
      seller,
      details,
    });
  } catch (err) {
    console.log("REGISTER SELLER ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
