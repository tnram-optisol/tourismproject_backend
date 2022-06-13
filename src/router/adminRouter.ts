import * as express from "express";
import {
  adminAllOrders,
  adminApproval,
  deleteCategory,
  getAllUsers,
  saveCategory,
  storeSequence,
  updateTourCategory,
  viewAllBanner,
  viewAllCategory,
  viewAllRequests,
} from "../controller/AdminController";

import upload from "../services/fileUpload";

const router = express.Router();

router.get("/request", viewAllRequests);

router.patch("/approve", adminApproval);

router.get("/banner", viewAllBanner);

router.patch("/sequence", storeSequence);

router.post("/category", upload.single("file"), saveCategory);

router.get("/category", viewAllCategory);

router.delete("/delete/:id", deleteCategory);

router.post("/update", updateTourCategory);

router.get("/all/users", getAllUsers);

router.get("/all/orders", adminAllOrders);

export default router;
