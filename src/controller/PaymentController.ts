import * as express from "express";
import * as paymentService from '../services/paymentService'
const router = express.Router();


router.post("/payment",paymentService.stripeCheckOut );

router.post("/refund",paymentService.refundPayment)

export default router;
