import * as express from "express";
import { stripeCheckOut } from "../controller/PaymentController";
const router = express.Router();

router.post("/payment", stripeCheckOut);

//router.post("/refund", paymentService.refundPayment);

export default router;
