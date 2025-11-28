import express from "express";
import {
  addProduct,
  deleteProduct,
  getProducts,
  getProductsOfStoreByCategory,
  getRestaurantsByCategory,
  searchProducts,
  updateProduct,
} from "../controllers/foodproducts.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const foodProductRouter = express.Router();

// ------------------------------
// SEARCH PRODUCTS (PUBLIC)
// ------------------------------

foodProductRouter.get("/search-restaurants", getRestaurantsByCategory);
foodProductRouter.get("/restaurant-foods/:storeId", getProductsOfStoreByCategory);

foodProductRouter.get("/search/:storeId", searchProducts);

// ------------------------------
// UPDATE PRODUCT (SELLER ONLY)
// ------------------------------
foodProductRouter.put(
  "/:storeId/:productIndex",
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
  updateProduct
);

// ------------------------------
// DELETE PRODUCT (SELLER ONLY)
// ------------------------------
foodProductRouter.delete(
  "/:storeId/:productIndex",
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
  deleteProduct
);

// ------------------------------
// GET ALL PRODUCTS (PUBLIC)
// ------------------------------
foodProductRouter.get("/:storeId", getProducts);

// ------------------------------
// ADD PRODUCT (SELLER ONLY)
// ------------------------------
foodProductRouter.post(
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
  addProduct
);

export default foodProductRouter;
