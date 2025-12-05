import { Router } from "express";
import authRouter from "./auth.route.js";
import cartRouter from "./foodcart.route.js";
import orderRouter from "./foodorder.route.js";
import foodProductRouter from "./foodproduct.route.js";
import foodStoreRouter from "./foodstore.route.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/food-store", foodStoreRouter);
mainRouter.use("/food-products", foodProductRouter);
mainRouter.use("/cart", cartRouter);
mainRouter.use("/order", orderRouter);
export default mainRouter;
