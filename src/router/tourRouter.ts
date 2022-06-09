import * as express from "express";
import { addTour, tourPagination, updateTour, viewTours } from "../controller/TourController";
import upload from "../services/fileUpload";

import * as tourService from '../services/tourService'

const router = express.Router();


//GET ALL TOURS
router.get("/view/all",viewTours);

router.patch("/update",upload.single('file'), updateTour);

//PAGINATIOn
router.get("/:take",tourPagination);

//POST REQUEST
router.post("/add",upload.single('file'),addTour);

//router.get("/all/orders", tourService.getAllOrders);

export default router;
