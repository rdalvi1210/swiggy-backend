import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/foodcart.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const cartRouter = express.Router();

cartRouter.post("/add", verifyToken, addToCart);
cartRouter.get("/getcart", verifyToken, getCart);
cartRouter.post("/remove", verifyToken, removeFromCart);
cartRouter.post("/update", verifyToken, updateQuantity);

export default cartRouter;
