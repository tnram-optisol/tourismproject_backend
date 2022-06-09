import * as express from "express";
import { getAllOrders, viewOrder } from "../controller/OrderController";
const router = express.Router();



router.get("/view/order/:id", viewOrder);

router.get("/all/orders", getAllOrders);

export default router;
