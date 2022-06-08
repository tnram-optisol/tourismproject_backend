import * as express from "express";

import * as adminService from "../services/adminService";
import upload from "../services/fileUpload";

const router = express.Router();

router.get("/admin/request", adminService.getAllRequests);

router.patch("/admin/approve", adminService.adminApproval);

router.get("/admin/banner", adminService.getAllBanner);

router.patch("/admin/sequence", adminService.storeSequence);

router.post("/admin/category",upload.single('file'), adminService.addCategory);

router.get("/admin/category", adminService.getCategory);

router.delete("/admin/delete/:id",adminService.deleteCategory);

router.post("/admin/update",adminService.updateTourCategory)

export default router;
