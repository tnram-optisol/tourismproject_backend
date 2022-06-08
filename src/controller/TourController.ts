import * as express from "express";
import upload from "../services/fileUpload";

import * as tourService from '../services/tourService'

const router = express.Router();


//GET ALL TOURS
router.get("/view/all",tourService.viewTours);

router.patch("/update",upload.single('file'), tourService.updateTour);

//PAGINATIOn
router.get("/:take",tourService.tourPaginate);

//POST REQUEST
router.post("/add",upload.single('file'),tourService.addTour);

router.get("/all/orders", tourService.getAllOrders);

export default router;
