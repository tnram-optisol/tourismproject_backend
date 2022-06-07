import * as express from "express";
import e = require("express");

import * as userService from "../services/userService";

const router = express.Router();

router.get("/view/tour", userService.getAllTours);

router.get("/home/tour", userService.getHomeTour);

router.get("/view/tour/:id", userService.viewTour);

router.get("/filter/tour/:category", userService.filterByCategory);

router.get("/view/hotel", userService.viewHotel);

router.get("/get/rooms/:id", userService.getRooms);

router.get("/view/room/:id", userService.viewRooms);

router.get("/get/user/tour/:take", userService.paginateTour);

router.post("/mail/admin",userService.sendMail);

router.get("/all/category",userService.getCategory)

router.get("/search/tour/:location",userService.searchTourData)

export default router;
