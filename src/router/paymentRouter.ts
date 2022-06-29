import * as express from "express";
import { PaymentController } from "../controller/PaymentController";

const router = express.Router();
const paymentController = new PaymentController();

router.post("/payment", paymentController.stripeCheckOut);

router.post("/refund/tour", paymentController.refundTourOrder);

router.post("/refund/hotel", paymentController.refundHotelOrder);

export default router;
