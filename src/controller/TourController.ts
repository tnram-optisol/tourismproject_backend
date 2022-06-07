import * as express from "express";
import upload from "../services/fileUpload";

import * as tourService from '../services/tourService'

const router = express.Router();


//GET ALL TOURS
router.get("/view/tours",tourService.viewTours);

router.patch("/update/tour",upload.single('file'), tourService.updateTour);

//PAGINATIOn
router.get("/get/tour/:take",tourService.tourPaginate);

//POST REQUEST
router.post("/add/tour",upload.single('file'),tourService.addTour);



export default router;
