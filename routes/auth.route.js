import { Router } from "express";
import {
  getCurrentUser,
  loginSeller,
  loginUser,
  logoutUser,
  registerSeller,
  registerUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/getCurrentUser", verifyToken, getCurrentUser);
authRouter.post("/logout", verifyToken, logoutUser);

//seller

authRouter.post("/seller-login", loginSeller);
authRouter.post("/seller-register", registerSeller);
export default authRouter;
