import { Router } from "express";
import {
  addAddress,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerSeller,
  registerUser,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const authRouter = Router();

// -----------------------------
// USER AUTH
// -----------------------------
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", verifyToken, getCurrentUser);
authRouter.post("/add-address", verifyToken, addAddress);

// LOGOUT – NO verifyToken
authRouter.get("/logout", logoutUser);

// -----------------------------
// SELLER AUTH
// -----------------------------
authRouter.post("/seller-register", registerSeller);
// seller login uses same /login

export default authRouter;
