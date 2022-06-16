import * as express from "express";
import { AdminController } from "../controller/AdminController";
import upload from "../services/fileUpload";

const router = express.Router();

const adminController = new AdminController();

router.get("/request", adminController.viewAllRequests);

router.patch("/approve", adminController.adminApproval);

router.get("/banner", adminController.viewAllBanner);

router.patch("/sequence", adminController.storeSequence);

router.post("/category", upload.single("file"), adminController.saveCategory);

router.get("/category", adminController.viewAllCategory);

router.delete("/delete/:id", adminController.deleteCategory);

router.post("/update", adminController.updateTourCategory);

router.get("/all/users", adminController.getAllUsers);

router.get("/all/orders", adminController.adminAllOrders);

export default router;
