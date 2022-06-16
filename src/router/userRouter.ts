import * as express from "express";
import { UserController } from "../controller/UserController";

const router = express.Router();
const userController = new UserController();

router.get("/view/tour", userController.getAllTours);

router.get("/home/tour", userController.getHomeTour);

router.get("/view/tour/:id", userController.viewTour);

router.get("/filter/tour/:category", userController.filterByCategory);

router.get("/view/hotel", userController.viewHotel);

router.get("/get/rooms/:id", userController.viewAllRooms);

router.get("/view/room/:id", userController.viewRooms);

router.get("/get/user/tour/:take", userController.paginateTour);

router.post("/mail/admin", userController.sendMail);

router.get("/all/category", userController.getCategory);

router.get("/search/tour/:location", userController.searchTourData);

router.post("/review", userController.postReview);

router.get("/review/:id", userController.viewReview);

router.get("/rating/:id", userController.viewRating);

export default router;

//for testing purpose
export { userController };