import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  registerSeller,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const authRouter = Router();

// -----------------------------
// USER AUTH
// -----------------------------
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", verifyToken, getCurrentUser);

// LOGOUT – NO verifyToken
authRouter.get("/logout", logoutUser);

// -----------------------------
// SELLER AUTH
// -----------------------------
authRouter.post("/seller-register", registerSeller);
// seller login uses same /login

export default authRouter;
