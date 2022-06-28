import * as express from "express";
import { body } from "express-validator";
import { BookingController } from "../controller/BookingController";

const router = express.Router();
const bookingController = new BookingController();
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
  bookingController.bookTour
);

router.get("/bookings/:user", bookingController.viewBookings);

router.patch("/cancel/tour/bookings", bookingController.cancelBookTour);

router.patch("/cancel/room/bookings", bookingController.cancelBookRoom);

router.get("/cancel/orders", bookingController.cancelOrder);

router.post(
  "/book/room",
  [
    body("bookHotel.maxPerson")
      .isNumeric()
      .custom((value, { req }) => {
        if (value >= 6) {
          throw new Error("Allowed Person must be less than 6");
        }
        return true;
      }),
    body("bookHotel.inDate").exists().withMessage("In Date must be a Date"),
    body("bookHotel.outDate").exists().withMessage("Out Date must be a Date"),
  ],
  bookingController.bookRoom
);

export default router;
