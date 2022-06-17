import * as express from "express";
import { body } from "express-validator";
import { TourController } from "../controller/TourController";
import upload from "../services/fileUpload";

import * as tourService from "../services/tourService";

const router = express.Router();
const tourController = new TourController();

//GET ALL TOURS
router.get("/view/all", tourController.viewTours);

router.patch(
  "/update",
  upload.single("file"),
  [
    body("startDate").isDate().withMessage("Start Date must be a Date"),
    body("endDate").isDate().withMessage("End Date must be a Date"),
    body("description").isAlpha().withMessage("Description must be a Text"),
    body("cost").isNumeric().withMessage("Tour cost Must be a Number"),
  ],
  tourController.updateTour
);

//PAGINATIOn
router.get("/:take", tourController.tourPagination);

//POST REQUEST
router.post(
  "/add",
  upload.single("file"),
  [
    body("name").isAlpha().withMessage("Package Name must be a Text"),
    body("from").isAlpha().withMessage("From location must be a Text"),
    body("to").isAlpha().withMessage("To location must be a Text"),
    body("license")
      .isAlphanumeric()
      .withMessage("Tour license Must be a Alpha-Numeric"),
    body("description").isAlpha().withMessage("Description must be a Text"),
    body("startDate").isDate().withMessage("Start Date must be a Date"),
    body("endDate").isDate().withMessage("End Date must be a Date"),
    body("days").isNumeric().withMessage("Tour days Must be a Number"),
    body("cost").isNumeric().withMessage("Tour cost Must be a Number"),
  ],
  tourController.addTour
);

router.get("/all/orders", tourController.getAdminTourOrders);

export default router;
