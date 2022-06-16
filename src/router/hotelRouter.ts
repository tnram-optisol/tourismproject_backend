import * as express from "express";
import { HotelController } from "../controller/HotelController";
import upload from "../services/fileUpload";

const router = express.Router();
const hotelController = new HotelController();

router.post("/add/hotel", upload.single("file"), hotelController.addHotel);

router.get("/view/all", hotelController.viewHotel);

router.post("/add/room", upload.single("file"), hotelController.addRooms);

router.get("/view/rooms/:id", hotelController.viewAllRooms);

router.get("/all/orders", hotelController.hotelAdminAllOrders);

export default router;
