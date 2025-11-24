import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import FoodStore from "../models/food.model.js";
import Grocery from "../models/groceries.model.js";
import Restaurant from "../models/restaurants.model.js";
import Seller from "../models/seller.model.js";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Seller Controller
// ===========================
// REGISTER SELLER
// ===========================
export const registerSeller = async (req, res) => {
  try {
    const { ownerName, email, password, sellerType } = req.body;

    // 1. Validate fields
    if (!ownerName || !email || !password || !sellerType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Only 3 types allowed
    if (!["restaurant", "food", "grocery"].includes(sellerType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sellerType.",
      });
    }

    // 2. Check duplicate seller
    const exist = await Seller.findOne({ email });
    if (exist) {
      return res.status(409).json({
        success: false,
        message: "Seller already exists.",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create seller
    const seller = await Seller.create({
      ownerName,
      email,
      password: hashedPassword,
      sellerType,
    });

    // 5. Create details based on sellerType
    let details;

    if (sellerType === "restaurant") {
      details = await Restaurant.create({ sellerId: seller._id });
    }
    if (sellerType === "food") {
      details = await FoodStore.create({ sellerId: seller._id });
    }
    if (sellerType === "grocery") {
      details = await Grocery.create({ sellerId: seller._id });
    }

    // Safety check
    if (!details) {
      return res.status(500).json({
        success: false,
        message: "Failed to create seller details.",
      });
    }

    // 6. Attach detailId to seller
    seller.sellerTypeId = details._id;
    await seller.save();

    return res.status(201).json({
      success: true,
      message: "Seller registered successfully.",
      seller,
      details,
    });

  } catch (error) {
    console.error("REGISTER SELLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



// ===========================
// LOGIN SELLER
// ===========================
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Check seller
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        sellerId: seller._id,
        role: seller.role,
        sellerType: seller.sellerType,
        sellerTypeId: seller.sellerTypeId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("seller_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // set to true for production HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Fetch details based on seller type
    let details = null;

    if (seller.sellerType === "restaurant") {
      details = await Restaurant.findById(seller.sellerTypeId);
    }
    if (seller.sellerType === "food") {
      details = await FoodStore.findById(seller.sellerTypeId);
    }
    if (seller.sellerType === "grocery") {
      details = await Grocery.findById(seller.sellerTypeId);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      seller,
      details,
      token,
    });

  } catch (error) {
    console.error("LOGIN SELLER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
