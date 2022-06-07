import * as express from "express";
import { body } from "express-validator";

import * as bookService from "../services/bookService";

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
  bookService.bookTour
);

router.get("/bookings/:user", bookService.viewBookings);

router.patch("/cancel/bookings", bookService.cancelBookTour);

router.get("/cancel/orders", bookService.cancelOrder);

router.post('/book/room',bookService.bookRoom)

export default router;
