import { response } from "express";
import {
  BOOKROOM,
  BOOKTOUR,
  BOOK_ROOM_DATA,
  BOOK_TOUR_DATA,
} from "../constants/db.constants";

export const tourRefundData = async (bookId, userId, payment?) => {
  const result = await BOOK_TOUR_DATA.findOneBy({
    book_id: bookId,
    user: {
      id: userId,
    },
  });
  return result;
};

export const viewTourBooking = async (userId) => {
  const result = await BOOK_TOUR_DATA.find({
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
  return result;
};

export const viewRoomBooking = async (userId) => {
  const result = await BOOK_ROOM_DATA.find({
    where: {
      user: {
        id: userId,
      },
      book_status: true,
    },
    order: {
      id: "DESC",
    },
  });
  return result;
};

export const cancelTourBooking = async (userId, bookId) => {
  const bookingExist = await BOOK_TOUR_DATA.findOneBy({
    user: {
      id: userId,
    },
    book_id: bookId,
    payment: false,
  });
  if (bookingExist) {
    const result = await BOOK_TOUR_DATA.remove(bookingExist);
    return result;
  }
  return false;
};

export const cancelRoomBooking = async (userId, bookId) => {
  const bookingExist = await BOOK_ROOM_DATA.findOneBy({
    user: {
      id: userId,
    },
    id:bookId,
    payment: false,
  });
  if (bookingExist) {
    const result = await BOOK_ROOM_DATA.remove(bookingExist);
    return result;
  }
  return false;
};

export const saveBookTour = async (tourId, userId, maxPerson) => {
  let bookingExist = await BOOK_TOUR_DATA.findOneBy({
    tour: {
      tour_id: tourId,
    },
    user: {
      id: userId,
    },
    payment: false,
  });
  let bookTour = BOOKTOUR;
  if (bookingExist) {
    bookingExist.max_person = maxPerson;
    const response = await BOOK_TOUR_DATA.save(bookingExist);
    return response;
  }
  bookTour.book_date = new Date().toLocaleDateString();
  bookTour.max_person = maxPerson;
  bookTour.book_status = true;
  bookTour.payment = false;
  bookTour.user = userId;
  bookTour.tour = tourId;
  const response = await BOOK_TOUR_DATA.save(bookTour);
  return response;
};

export const bookNewRoom = async (newRoom) => {
  const bookRoom = BOOKROOM;
  bookRoom.total_person = newRoom.maxPerson;
  bookRoom.in_Date = newRoom.inDate;
  bookRoom.out_Date = newRoom.outDate;
  bookRoom.user = newRoom.user;
  bookRoom.room = newRoom.roomId;
  bookRoom.payment = false;
  bookRoom.book_status = true;
  bookRoom.total_Days = calcTotalDays(newRoom.inDate, newRoom.outDate);

  const response = await BOOK_ROOM_DATA.save(bookRoom);
  return response;
};

function calcTotalDays(inDate: string, outDate: string): number {
  let checkIn = new Date(inDate).getDate();
  let checkOut = new Date(outDate).getDate();
  if (checkIn - checkOut === 0) {
    return 1;
  }
  return checkOut - checkIn;
}
