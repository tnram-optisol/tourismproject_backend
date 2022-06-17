import * as express from "express";
import { PaymentController } from "../controller/PaymentController";

const router = express.Router();
const paymentController = new PaymentController()

router.post("/payment", paymentController.stripeCheckOut);

router.post("/refund", paymentController.refund);

export default router;
