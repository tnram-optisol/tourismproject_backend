import * as express from "express";
import * as reviewService from "../services/reviewService";

const router = express.Router();

router.post("/review", reviewService.postReview);

router.get("/review/:id", reviewService.viewReview);

router.get("/rating/:id", reviewService.getRating);

export default router;
