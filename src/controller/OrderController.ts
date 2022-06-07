import * as express from "express";
import * as orderService from "../services/orderService";
const router = express.Router();



router.get("/view/order/:id", orderService.viewOrder);

router.get("/all/orders", orderService.getAllOrders);

export default router;
