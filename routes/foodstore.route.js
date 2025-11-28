import express from "express";
import {
  getFoodStore,
  updateFoodStore,
} from "../controllers/foodstore.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const foodStoreRouter = express.Router();

// PUBLIC: GET FOOD STORE INFO
foodStoreRouter.get("/:storeId", getFoodStore);

// PROTECTED: UPDATE STORE INFO (SELLERS ONLY)
foodStoreRouter.put(
  "/:storeId",
  verifyToken,
  (req, res, next) => {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Sellers only.",
      });
    }
    next();
  },
  updateFoodStore
);

export default foodStoreRouter;
