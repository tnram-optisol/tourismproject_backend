import * as express from "express";
import { TourController } from "../controller/TourController";
import upload from "../services/fileUpload";

import * as tourService from "../services/tourService";

const router = express.Router();
const tourController = new TourController();

//GET ALL TOURS
router.get("/view/all", tourController.viewTours);

router.patch("/update", upload.single("file"), tourController.updateTour);

//PAGINATIOn
router.get("/:take", tourController.tourPagination);

//POST REQUEST
router.post("/add", upload.single("file"), tourController.addTour);

router.get("/all/orders", tourController.getAdminTourOrders);

export default router;
