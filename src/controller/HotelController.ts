import * as express from "express";
import * as hotelService from "../services/hotelService";
;


const router = express.Router();

router.post("/add/hotel", hotelService.addHotel);

router.get("/view/all", hotelService.viewHotel);

router.post("/add/room", hotelService.addRooms);

router.get("/view/rooms/:id", hotelService.getAllRooms);

export default router;
