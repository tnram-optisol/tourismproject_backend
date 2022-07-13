import * as express from "express";
import { body } from "express-validator";
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

router.post(
  "/mail/admin",
  [
    body("name").isAlpha().withMessage("Invalid Name"),
    body("email").isEmail().withMessage("Invalid email"),
    body("message").exists().withMessage("Invalid message"),
  ],
  userController.sendMail
);

router.get("/all/category", userController.getCategory);

router.get("/search/tour/:location", userController.searchTourData);

router.post(
  "/review",
  [
    body("name").isAlpha().withMessage("Invalid Name"),
    body("rating").isNumeric().isInt({ min: 1 }).withMessage("Invalid Rating"),
    body("comment").exists().withMessage("Invalid Comment"),
  ],
  userController.postReview
);

router.get("/review/:id", userController.viewReview);

router.get("/rating/:id", userController.viewRating);

router.get("/user/profile", userController.viewProfile);

router.get("/user/coupon", userController.getUserCoupon);

router.post(
  "/update/profile",
  [
    body("user.email").isEmail().withMessage("Invalid Email"),
    body("user.password").isLength({ min: 6 }).withMessage("Invalid Password"),
    body("user.name").isAlpha().withMessage("Invalid Name"),
    body("user.place").isAlpha().withMessage("Invalid Place"),
    body("user.contact").isNumeric().withMessage("Invalid Contact"),
    body("user.roleId").isNumeric().withMessage("Invalid RoleId"),
  ],
  userController.updateProfile
);

export default router;

//for testing purpose
export { userController };
