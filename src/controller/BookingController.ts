import * as express from "express";
import { validationResult } from "express-validator";
import {
  BOOKROOM,
  BOOKTOUR,
  BOOK_ROOM_DATA,
  BOOK_TOUR_DATA,
  TOUR_DATA,
  TOUR_ORDER_DATA,
} from "../constants/db.constants";
import {
  bookNewRoom,
  cancelTourBooking,
  saveBookTour,
  viewRoomBooking,
  viewTourBooking,
} from "../services/bookService";
import { cancelTourOrder } from "../services/orderService";

export const bookTour = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let tourId = req.body.userData.package_id;
  let userId = req.body.userData.user.id;
  let maxPerson = req.body.userData.maxPerson;
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    return res.status(400).json({ errors: validationErr.array() });
    next();
  }
  const newBooking = await saveBookTour(tourId, userId, maxPerson);

  return res.status(200).json("Awaiting your confirmation with payment");
};

export const cancelBookTour = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  const response = await cancelTourBooking(userId, req.body.bookId);
  if (response) {
    return res.status(200).json("Booking Removed Successfully");
  }
  return res.status(400).json("Book Some Tour Packages");
};

export const viewBookings = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  let tourBooking = await viewTourBooking(userId);
  let roomBooking = await viewRoomBooking(userId);
  if (tourBooking || roomBooking) {
    return res.status(200).json({ tourBooking, roomBooking });
    next();
  }
  return res.status(400).json("Book Some Tour Packages");
};

export const cancelOrder = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  let orderExist = await cancelTourOrder(userId);
  if (orderExist) {
    return res.status(200).json(orderExist);
  }
  return res.status(400).json("No order Canceled");
};

export const bookRoom = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let newRoom = {
    roomId: req.body.bookHotel.roomId,
    maxPerson: req.body.bookHotel.maxPerson,
    inDate: req.body.bookHotel.inDate,
    outDate: req.body.bookHotel.outDate,
    user: req.body.bookHotel.user,
    room: req.body.bookHotel.roomId,
  };

  const result = await bookNewRoom(newRoom);
  return res.status(200).json("Awaiting your confirmation with payment");
};

function calcTotalDays(inDate: string, outDate: string): number {
  let checkIn = new Date(inDate).getDate();
  let checkOut = new Date(outDate).getDate();
  return checkOut - checkIn;
}
