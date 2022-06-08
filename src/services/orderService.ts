import * as express from "express";
import { HOTEL_ORDER_DATA, TOUR_ORDER_DATA } from "../constants/db.constants";

export const viewOrder = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let booking_id = +req.params.id;
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  if (userId !== 0) {
    let tourOrderExist = await TOUR_ORDER_DATA.findOneBy({
      bookTour: {
        book_id: booking_id,
      },
      user: {
        id: userId,
      },
    });
    let hotelOrderExist = await HOTEL_ORDER_DATA.findOneBy({
      bookRoom: {
        id: booking_id,
      },
      user: {
        id: userId,
      },
    });
    if (tourOrderExist || hotelOrderExist) {
      return res.status(200).json({ tourOrderExist, hotelOrderExist });
    }
  }
  return res.status(400).json("No Orders Exists...");
};

export const getAllOrders = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const roleId = +req.headers.role[0];
  if (roleId === 3) {
    let tourOrderExist = await TOUR_ORDER_DATA.find({
      order: {
        orderdAt: "DESC",
      },
    });
    if (tourOrderExist) {
      return res.status(200).json(tourOrderExist);
    }
  } else {
    let hotelOrderExist = await HOTEL_ORDER_DATA.find({
      order: {
        orderdAt: "DESC",
      },
    });
    if (hotelOrderExist) {
      return res.status(200).json(hotelOrderExist);
    }
  }
  return res.status(400).json("No Orders Exists...");
};
