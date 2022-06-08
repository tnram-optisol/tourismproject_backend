import * as express from "express";
import { validationResult } from "express-validator";
import { BOOKROOM, BOOKTOUR, BOOK_ROOM_DATA, BOOK_TOUR_DATA, TOUR_DATA, TOUR_ORDER_DATA } from "../constants/db.constants";


export const bookTour = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let tourId = req.body.userData.package_id;
  const validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    return res.status(400).json({ errors: validationErr.array() });
    next();
  }
  let bookingExist = await BOOK_TOUR_DATA.findOneBy({
    tour: {
      tour_id: tourId,
    },
    user: {
      id: req.body.userData.user.id,
    },
    payment: false,
  });
  let bookTour = BOOKTOUR
  if (bookingExist) {
    bookingExist.max_person = req.body.userData.maxPerson;
    await BOOK_TOUR_DATA.save(bookingExist);

    if (bookingExist.payment) {
      let myTourData = await TOUR_DATA.findOneBy({
        tour_id: tourId,
      });
    }
    return res.status(200).json("Awaiting your confirmation with payment");
  }
  bookTour.book_date = new Date().toLocaleDateString();
  bookTour.max_person = req.body.userData.maxPerson;
  bookTour.book_status = true;
  bookTour.payment = false;
  bookTour.user = req.body.userData.user.id;
  bookTour.tour = tourId;

  await BOOK_TOUR_DATA.save(bookTour);
  return res.status(200).json("Awaiting your confirmation with payment");
  
};

export const cancelBookTour = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  let bookingExist = await BOOK_TOUR_DATA.findOneBy({
    user: {
      id: userId,
    },
    book_id: req.body.bookId,
    payment: false,
  });
  if (bookingExist) {
    if (bookingExist.payment) {
      let myTourData = await TOUR_DATA.findOneBy({
        tour_id: bookingExist.tour.tour_id,
      });
      if (myTourData) {
        myTourData.max_person = myTourData.max_person + bookingExist.max_person;
        await TOUR_DATA.save(myTourData);
        return res.status(200).json("Booking Done Successfully");
      }
    }
    await BOOK_TOUR_DATA.remove(bookingExist);
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
  let tourBooking = await BOOK_TOUR_DATA.find({
    where: {
      user: {
        id: userId,
      },
      book_status: true,
    },
    order: {
      book_id: "DESC",
    },
  });
  let roomBooking  = await BOOK_ROOM_DATA.find({
      where:{
          user:{
              id:userId
          },
        book_status:true
      },
      order:{
          id:"DESC"
      }
  })
  if (tourBooking || roomBooking) {
    return res.status(200).json({tourBooking,roomBooking});
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
  let orderExist = await TOUR_ORDER_DATA.find({
    where: {
      user: {
        id: userId,
      },
      orderStatus: false,
    },
    order: {
      orderdAt: "DESC",
    },
  });
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
  let roomId = req.body.bookHotel.roomId;

  const bookRoom = BOOKROOM;
  bookRoom.book_status = true;
  bookRoom.total_person = req.body.bookHotel.maxPerson;
  bookRoom.in_Date = req.body.bookHotel.inDate;
  bookRoom.out_Date = req.body.bookHotel.outDate;
  bookRoom.user = req.body.bookHotel.user;
  bookRoom.room = req.body.bookHotel.roomId;
  bookRoom.payment = false;
  bookRoom.total_Days = calcTotalDays(
    req.body.bookHotel.inDate,
    req.body.bookHotel.outDate
  );

  await BOOK_ROOM_DATA.save(bookRoom);
  return res.status(200).json("Awaiting your confirmation with payment");
};

function calcTotalDays(inDate: string, outDate: string): number {
  let checkIn = new Date(inDate).getDate();
  let checkOut = new Date(outDate).getDate();
  return checkOut -checkIn
}
