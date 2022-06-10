import * as express from "express";
import { body } from "express-validator";
import {
  bookRoom,
  bookTour,
  cancelBookRoom,
  cancelBookTour,
  cancelOrder,
  viewBookings,
} from "../controller/BookingController";

const router = express.Router();

router.post(
  "/book/tour",
  [
    body("userData.maxPerson")
      .isNumeric()
      .custom((value, { req }) => {
        if (value >= 6) {
          throw new Error("Allowed Person must be less than 6");
        }
        return true;
      }),
  ],
  bookTour
);

router.get("/bookings/:user", viewBookings);

router.patch("/cancel/bookings", cancelBookTour);

router.patch("/cancel/room/bookings", cancelBookRoom);

router.get("/cancel/orders", cancelOrder);

router.post("/book/room", bookRoom);

export default router;
