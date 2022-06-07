import Stripe from "stripe";
import * as express from "express";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { BookTour } from "../entity/BookTour";
import { AppDataSource } from "../data-source";
import { TourOrders } from "../entity/TourOrders";

require("dotenv").config();

const bookData = AppDataSource.getRepository(BookTour);
const tourOrder = AppDataSource.getRepository(TourOrders);
const idempotencyKey = uuidv4();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`, {
  apiVersion: "2020-08-27",
});

export const stripeCheckOut = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const { product } = req.body;
  const generateCoupon = await stripe.coupons.create({
    percent_off: product.discount,
    name: "VIPCOUPON",
    currency: "inr",
    duration: "forever",
  });
  const promotionCode = await stripe.promotionCodes.create({
    coupon: generateCoupon.id,
  });

  const session = await stripe.checkout.sessions.create({
    metadata: {
      package_name: product.name,
      userId: product.user,
      discount: product.discount,
    },
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: [
        "US",
        "CA",
        "IN",
        "FR",
        "GE",
        "MA",
        "JP",
        "CH",
        "BL",
        "LK",
      ],
    },
    line_items: [
      {
        price_data: {
          product_data: {
            name: product.name,
          },
          currency: "inr",
          unit_amount: product.cost * 100,
        },
        description: product.description,
        quantity: product.totalPerson,
      },
    ],
    success_url: `${process.env.SUCCESS_URL}`,
    cancel_url: `${process.env.CANCEL_URL}`,
    mode: "payment",
    allow_promotion_codes: true,
  });
  return res.send({ url: session.url });
};

export const refundPayment = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let bookId = +req.body.bookId;
  let userId = +req.headers.user[0];
  let orderExist = await tourOrder.findOneBy({
    bookTour: {
      book_id: bookId,
    },
    user: {
      id: userId,
    },
    orderStatus: true,
  });
  let bookingExist = await bookData.findOneBy({
    book_id: bookId,
    user: {
      id: userId,
    },
  });
  if (orderExist) {
    stripe.refunds
      .create({
        payment_intent: orderExist.paymentId,
      })
      .then(async (result) => {
        orderExist.orderStatus = false;
        bookingExist.book_status = false;
        await bookData.save(bookingExist);
        await tourOrder.save(orderExist);
      })
      .catch((err) => {
        console.log(err);
      });
    return res.status(200).json("Order Canceled");
  }
  return res.status(400).json("Data Not Found");
};
