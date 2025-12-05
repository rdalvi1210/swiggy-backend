import express from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const orderRouter = express.Router();

orderRouter.post("/create", verifyToken, createOrder);
orderRouter.get("/my-orders", verifyToken, getMyOrders);
orderRouter.get("/getseller-orders", verifyToken, getSellerOrders);

export default orderRouter;
