import * as express from "express";
import { body } from "express-validator";
import { HotelController } from "../controller/HotelController";
import upload from "../services/fileUpload";

const router = express.Router();
const hotelController = new HotelController();

router.post(
  "/add/hotel",
  upload.single("file"),
  [
    body("latitude").isNumeric().withMessage("Latitude Must be a Number"),
    body("longitude").isNumeric().withMessage("Longitude Must be a Number"),
    body("name").isAlpha().withMessage("Hotel Name Must be a string"),
    body("address").exists().withMessage("Hotel address Must be a string"),
    body("license")
      .exists()
      .withMessage("Hotel license Must be a Alpha-Numeric"),
  ],
  hotelController.addHotel
);

router.get("/view/all", hotelController.viewHotel);

router.post(
  "/add/room",
  upload.single("file"),
  [
    body("maxPerson").isNumeric().withMessage("maxPerson Must be a Number"),
    body("cost").isNumeric().withMessage("Room cost Must be a Number"),
    body("name").isAlpha().withMessage("Room Name Must be a string"),
    body("description")
      .exists()
      .withMessage("Room description Must be a string"),
  ],
  hotelController.addRooms
);

router.get("/view/rooms/:id", hotelController.viewAllRooms);

router.get("/all/orders", hotelController.hotelAdminAllOrders);

export default router;
