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

export const getAllTourOrders = async (
  take?: number,
  skip?: number,
  search?: any
) => {
  if (take !== 0 || skip !== 0) {
    const result = await TOUR_ORDER_DATA.findAndCount({
      order: {
        orderdAt: "DESC",
      },
      take: take,
      skip: skip,
    });
    return result;
  }
  if (search !== "") {
    const result = await TOUR_ORDER_DATA.createQueryBuilder("orders")
      .innerJoinAndSelect("orders.bookTour", "booktour")
      .innerJoinAndSelect("booktour.tour", "tour")
      .where(
        "orders.order_id ILIKE :q or orders.description ILIKE :q or orders.purchased_by ILIKE :q or orders.email ILIKE :q",
        { q: `%${search}%` }
      )
      .getMany();
    return result;
  }
  const result = await TOUR_ORDER_DATA.find({
    order: {
      orderdAt: "DESC",
    },
  });
  return result;
};

export const getAllHotelOrders = async (
  take?: number,
  skip?: number,
  search?: any
) => {
  if (take !== 0 || skip !== 0) {
    const result = await HOTEL_ORDER_DATA.findAndCount({
      order: {
        orderdAt: "DESC",
      },
      take: take,
      skip: skip,
    });
    return result;
  }
  if (search !== "") {
    const result = await HOTEL_ORDER_DATA.createQueryBuilder("orders")
      .innerJoinAndSelect("orders.bookRoom", "bookRoom")
      .innerJoinAndSelect("bookRoom.room", "room")
      .where(
        "orders.order_id ILIKE :q or orderss.description ILIKE :q or orders.purchased_by ILIKE :q or orders.email ILIKE :q",
        { q: `%${search}%` }
      )
      .getMany();
    console.log(result);
    return result;
  }
  const result = await HOTEL_ORDER_DATA.find({
    order: {
      orderdAt: "DESC",
    },
  });
  return result;
};

export const cancelTourOrder = async (
  userId: number,
  take?: number,
  limit?: number
) => {
  const result = await TOUR_ORDER_DATA.findAndCount({
    where: {
      user: {
        id: userId,
      },
      orderStatus: false,
    },
    order: {
      orderdAt: "DESC",
    },
    take: take,
    skip: limit,
  });
  return result;
};

export const cancelRoomOrder = async (
  userId: number,
  take?: number,
  limit?: number
) => {
  const result = await HOTEL_ORDER_DATA.findAndCount({
    where: {
      user: {
        id: userId,
      },
      orderStatus: false,
    },
    order: {
      orderdAt: "DESC",
    },
    take: take,
    skip: limit,
  });
  return result;
};
