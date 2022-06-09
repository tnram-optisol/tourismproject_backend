import * as express from "express";
import {
  addHotel,
  addRooms,
  viewAllRooms,
  viewHotel,
} from "../controller/HotelController";

const router = express.Router();

router.post("/add/hotel", addHotel);

router.get("/view/all", viewHotel);

router.post("/add/room", addRooms);

router.get("/view/rooms/:id", viewAllRooms);

export default router;
