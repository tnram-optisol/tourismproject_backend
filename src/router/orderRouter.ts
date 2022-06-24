import * as express from "express";
import { OrderController } from "../controller/OrderController";

const router = express.Router();
const orderController = new OrderController();

router.get("/view/order/:id", orderController.viewOrder);

router.get("/all/orders", orderController.getAllOrders);

export default router;
