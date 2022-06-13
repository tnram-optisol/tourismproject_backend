import { HOTEL_ORDER_DATA, TOUR_ORDER_DATA } from "../constants/db.constants";

export const tourOrderRefund = async (bookId, userId) => {
  const result = await TOUR_ORDER_DATA.findOneBy({
    bookTour: {
      book_id: bookId,
    },
    user: {
      id: userId,
    },
    orderStatus: true,
  });
  return result;
};

export const hotelOrderId = async (bookId: number, userId: number) => {
  const result = await HOTEL_ORDER_DATA.findOneBy({
    bookRoom: {
      id: bookId,
    },
    user: {
      id: userId,
    },
  });
  return result;
};

export const tourOrderId = async (bookId: number, userId: number) => {
  const result = await TOUR_ORDER_DATA.findOneBy({
    bookTour: {
      book_id: bookId,
    },
    user: {
      id: userId,
    },
  });
  return result;
};

export const getAllTourOrders = async () => {
  const result = await TOUR_ORDER_DATA.find({
    order: {
      orderdAt: "DESC",
    },
  });
  return result;
};

export const getAllHotelOrders = async () => {
  const result = await HOTEL_ORDER_DATA.find({
    order: {
      orderdAt: "DESC",
    },
  });
  return result;
};

export const cancelTourOrder = async (userId) => {
  const result = await TOUR_ORDER_DATA.find({
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
  return result;
};
