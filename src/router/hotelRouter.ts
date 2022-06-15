import * as express from "express";
import {
  addHotel,
  addRooms,
  hotelAdminAllOrders,
  viewAllRooms,
  viewHotel,
} from "../controller/HotelController";
import upload from "../services/fileUpload";

const router = express.Router();

router.post("/add/hotel", upload.single("file"), addHotel);

router.get("/view/all", viewHotel);

router.post("/add/room", upload.single("file"), addRooms);

router.get("/view/rooms/:id", viewAllRooms);

router.get("/all/orders", hotelAdminAllOrders);

export default router;
