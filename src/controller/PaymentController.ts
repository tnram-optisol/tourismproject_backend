import * as express from "express";
import { tourRefundData } from "../services/bookService";
import { tourOrderRefund } from "../services/orderService";
import {
  createCheckOustSession,
  createRefund,
} from "../services/paymentService";

export const stripeCheckOut = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { product } = req.body;

  const session = await createCheckOustSession(product);
  return res.send({ url: session.url });
};

export const refund = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let bookId = +req.body.bookId;
  let userId = +req.headers.user[0];
  let orderExist = await tourOrderRefund(bookId, userId);
  let bookingExist = await tourRefundData(bookId, userId);
  if (orderExist) {
    const response = await createRefund(orderExist, bookingExist);
    return res.status(200).json("Order Canceled");
  }
  return res.status(400).json("Data Not Found");
};
