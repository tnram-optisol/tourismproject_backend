import * as express from "express";

import * as adminService from "../services/adminService";
import upload from "../services/fileUpload";

const router = express.Router();

router.get("/request", adminService.getAllRequests);

router.patch("/approve", adminService.adminApproval);

router.get("/banner", adminService.getAllBanner);

router.patch("/sequence", adminService.storeSequence);

router.post("/category",upload.single('file'), adminService.addCategory);

router.get("/category", adminService.getCategory);

router.delete("/delete/:id",adminService.deleteCategory);

router.post("/update",adminService.updateTourCategory)

export default router;
