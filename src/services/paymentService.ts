import Stripe from "stripe";
import * as express from "express";
import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import {
  BOOK_ROOM_DATA,
  BOOK_TOUR_DATA,
  HOTEL_ORDER_DATA,
  TOUR_ORDER_DATA,
} from "../constants/db.constants";
import { tourRefundData } from "./bookService";
import { tourOrderRefund } from "./orderService";
import { Notification } from "../entity/Notification";
import { AppDataSource } from "../data-source";
import { BookRoom } from "../entity/BookRoom";
import { HotelOrders } from "../entity/HotelOrders";
import { BookTour } from "../entity/BookTour";
import { TourOrders } from "../entity/TourOrders";

require("dotenv").config();

const idempotencyKey = uuidv4();

const stripe = new Stripe(`${process.env.STRIPE_KEY}`, {
  apiVersion: "2020-08-27",
});

export const createCheckOustSession = async (product) => {
  const generateCoupon = await stripe.coupons.create({
    percent_off: product.discount,
    currency: "inr",
    duration: "forever",
  });
  try {
    const promotionCode = await stripe.promotionCodes.create({
      coupon: generateCoupon.id,
      code: "TOUR20",
    });
  } catch (err) {
    console.log(err);
  }

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
  return session;
};

export const createRefund = async (
  orderExist: TourOrders,
  bookingExist: BookTour
) => {
  return stripe.refunds
    .create({
      payment_intent: orderExist.paymentId,
    })
    .then(async (result) => {
      const message = `${bookingExist.user.name} has canceled Booking for ${bookingExist.tour.package_name}`;
      const type = "tour_order";

      const newNotification = new Notification();
      newNotification.notification = message;
      newNotification.type = type;

      await AppDataSource.manager.save(newNotification);
      orderExist.orderStatus = false;
      bookingExist.book_status = false;
      await BOOK_TOUR_DATA.save(bookingExist);
      await TOUR_ORDER_DATA.save(orderExist);
      return orderExist;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const createHotelRefund = async (
  orderExist: HotelOrders,
  bookingExist: BookRoom
) => {
  return stripe.refunds
    .create({
      payment_intent: orderExist.paymentId,
    })
    .then(async (result) => {
      const message = `${bookingExist.user.name} has canceled Booking for ${bookingExist.room.room_name}`;
      const type = "hotel_order";

      const newNotification = new Notification();
      newNotification.notification = message;
      newNotification.type = type;

      await AppDataSource.manager.save(newNotification);
      orderExist.orderStatus = false;
      bookingExist.book_status = false;
      await BOOK_ROOM_DATA.save(bookingExist);
      await HOTEL_ORDER_DATA.save(orderExist);
      return orderExist;
    })
    .catch((err) => {
      console.log(err);
    });
};
