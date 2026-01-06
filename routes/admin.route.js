import express from "express";
import {
  adminDeleteProduct,
  adminDeleteSeller,
  adminDeleteStore,
  adminGetAllProducts,
  adminGetAllSellers,
  adminGetAllStores,
  adminGetStoreById,
  adminUpdateProduct,
  adminUpdateStore,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const adminRouter = express.Router();

adminRouter.get("/products", verifyToken, adminGetAllProducts);
adminRouter.put(
  "/products/:storeId/:productId",
  verifyToken,
  adminUpdateProduct
);
adminRouter.delete(
  "/products/:storeId/:productId",
  verifyToken,
  adminDeleteProduct
);

adminRouter.get("/stores", verifyToken, adminGetAllStores);
adminRouter.get("/stores/:storeId", verifyToken, adminGetStoreById);
adminRouter.put("/stores/:storeId", verifyToken, adminUpdateStore);
adminRouter.delete("/stores/:storeId", verifyToken, adminDeleteStore);
adminRouter.get("/sellers", verifyToken, adminGetAllSellers);
adminRouter.delete("/sellers/:sellerId", verifyToken, adminDeleteSeller);

export default adminRouter;
