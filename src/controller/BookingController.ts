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
  cancelRoomBooking,
  cancelTourBooking,
  saveBookTour,
  viewRoomBooking,
  viewTourBooking,
} from "../services/bookService";
import { createNewNotification } from "../services/notificationService";
import { cancelRoomOrder, cancelTourOrder } from "../services/orderService";

export class BookingController {
  bookTour = async (req: express.Request, res: express.Response, next) => {
    let tourId = req.body.userData.package_id;
    let userId = req.body.userData.user.id;
    let maxPerson = req.body.userData.maxPerson;
    let role = req.headers.role[0] ? parseInt(req.headers.role[0]) : 0;
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    if (role !== 4) {
      return res
        .status(400)
        .json({ errors: "You Must be a User to Book Any Packages" });
    }
    const newBooking = await saveBookTour(tourId, userId, maxPerson);

    return res.status(200).json("Awaiting your confirmation with payment");
  };

  cancelBookTour = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    if (userId === 0) {
      return res.status(400).json("Please check your credentials");
    }
    const response = await cancelTourBooking(userId, req.body.bookId);
    if (response) {
      return res.status(200).json("Booking Removed Successfully");
    }
    return res.status(400).json("Book Some Tour Packages");
  };

  cancelBookRoom = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    if (userId === 0) {
      return res.status(400).json("Please check your credentials");
    }
    const response = await cancelRoomBooking(userId, req.body.bookId);
    if (response) {
      return res.status(200).json("Booking Removed Successfully");
    }
    return res.status(400).json("Book Some Tour Packages");
  };

  viewBookings = async (req: express.Request, res: express.Response, next) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    if (userId === 0) {
      return res.status(400).json("Please check your credentials");
    }
    let tourBooking = await viewTourBooking(userId, limit, skip);
    let roomBooking = await viewRoomBooking(userId,limit, skip);
    if (tourBooking || roomBooking) {
      return res.status(200).json({ tourBooking, roomBooking });
    }
    return res.status(400).json("Book Some Tour Packages");
  };

  cancelOrder = async (req: express.Request, res: express.Response, next) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    if (userId === 0) {
      return res.status(400).json("Please check your credentials");
    }
    let orderExist = await cancelTourOrder(userId, limit, skip);
    let hotelOrder = await cancelRoomOrder(userId, limit, page);
    if (orderExist) {
      return res.status(200).json(orderExist);
    }
    return res.status(400).json("No order Canceled");
  };

  bookRoom = async (req: express.Request, res: express.Response, next) => {
    const validationErr = validationResult(req);
    let newRoom = {
      roomId: req.body.bookHotel.roomId,
      maxPerson: req.body.bookHotel.maxPerson,
      inDate: req.body.bookHotel.inDate,
      outDate: req.body.bookHotel.outDate,
      user: req.body.bookHotel.user,
      room: req.body.bookHotel.roomId,
    };
    let role = req.headers.role[0] ? parseInt(req.headers.role[0]) : 0;
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    if (role !== 4) {
      return res
        .status(400)
        .json({ errors: "You Must be a User to Book Any Packages" });
    }
    const result = await bookNewRoom(newRoom);
    return res.status(200).json("Awaiting your confirmation with payment");
  };

  calcTotalDays(inDate: string, outDate: string): number {
    let checkIn = new Date(inDate).getDate();
    let checkOut = new Date(outDate).getDate();
    return checkOut - checkIn;
  }
}
