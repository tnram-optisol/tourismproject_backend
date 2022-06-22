import * as express from "express";
import { body, check } from "express-validator";

import { AdminController } from "../controller/AdminController";
import upload from "../services/fileUpload";

const router = express.Router();

const adminController = new AdminController();

router.get("/request", adminController.viewAllRequests);

router.patch(
  "/approve",
  [
    body("user").isNumeric().withMessage("Must be a Number"),
    body("status").isBoolean().withMessage("Status Must be a Boolean Type"),
    body("property").isNumeric().withMessage("Property Must be a Number"),
    body("role").isNumeric().withMessage("Must be a Number"),
  ],
  adminController.adminApproval
);

router.get("/banner", adminController.viewAllBanner);

router.patch(
  "/sequence",
  [body("sequence").isNumeric().withMessage("Sequence Must be a Number")],
  adminController.storeSequence
);

router.post(
  "/category",
  upload.single("file"),
  [body("category_name").isAlpha().withMessage(" Category_name Must be a text")],
  adminController.saveCategory
);

router.get("/category", adminController.viewAllCategory);

router.delete("/delete/:id", adminController.deleteCategory);

router.post(
  "/update",
  [
    body("tour.tour").isNumeric().withMessage("Must be a Number"),
    body("tour.category").isArray({min:1}).withMessage("Category Must be a Array"),
    body("tour.closedOn").exists().withMessage("Closed on Must be a Date"),
  ],
  adminController.updateTourCategory
);

router.get("/all/users", adminController.getAllUsers);

router.get("/all/orders", adminController.adminAllOrders);

export default router;
