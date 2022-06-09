import * as express from "express";
import {
  filterByCategory,
  getAllTours,
  getCategory,
  getHomeTour,
  paginateTour,
  postReview,
  searchTourData,
  sendMail,
  viewAllRooms,
  viewHotel,
  viewRating,
  viewReview,
  viewRooms,
  viewTour,
} from "../controller/UserController";

const router = express.Router();

router.get("/view/tour", getAllTours);

router.get("/home/tour", getHomeTour);

router.get("/view/tour/:id", viewTour);

router.get("/filter/tour/:category", filterByCategory);

router.get("/view/hotel", viewHotel);

router.get("/get/rooms/:id", viewAllRooms);

router.get("/view/room/:id", viewRooms);

router.get("/get/user/tour/:take", paginateTour);

router.post("/mail/admin", sendMail);

router.get("/all/category", getCategory);

router.get("/search/tour/:location", searchTourData);

router.post("/review", postReview);

router.get("/review/:id", viewReview);

router.get("/rating/:id", viewRating);

export default router;
