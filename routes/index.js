import { Router } from "express";
import authRouter from "./auth.route.js";
import foodStoreRouter from "./foodstore.route.js";
import foodProductRouter from "./foodproduct.route.js";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/food-store", foodStoreRouter);
mainRouter.use("/food-products", foodProductRouter);
export default mainRouter;
