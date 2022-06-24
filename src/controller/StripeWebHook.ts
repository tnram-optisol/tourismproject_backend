import Stripe from "stripe";
import * as express from "express";
import "dotenv/config";
import * as bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import { BookTour } from "../entity/BookTour";
import { AppDataSource } from "../data-source";
import { TourOrders } from "../entity/TourOrders";
import { BookRoom } from "../entity/BookRoom";
import { HotelOrders } from "../entity/HotelOrders";
const router = express.Router();

require("dotenv").config();

const bookData = AppDataSource.getRepository(BookTour);
const tourOrder = AppDataSource.getRepository(TourOrders);
const bookRoomData = AppDataSource.getRepository(BookRoom);
const hotelOrderData = AppDataSource.getRepository(HotelOrders);

const stripe = new Stripe(`${process.env.STRIPE_KEY}`, {
  apiVersion: "2020-08-27",
});
const idempotencyKey = uuidv4();

router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    console.log("stripe working");
    const endpointSecret =
      "whsec_cdde44d19ecc828993fbb259e5764d68029560ae98f5196aac31a1979c96c975";
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        "whsec_cdde44d19ecc828993fbb259e5764d68029560ae98f5196aac31a1979c96c975"
      );
    } catch (err) {
      console.log(err);
      console.log(endpointSecret);
      return;
    }
    // Handle the event
    switch (event.type) {
      case "payment_intent.created":
        const paymentCreated = event.data.object;
        console.log("payment_intent.created");
        break;
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(`${event.type}`);
        break;
      case "checkout.session.completed":
        const checkOut = event.data.object;
        console.log(`${event.type}`);
        const storeData = await storeOrder(checkOut);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.status(200).json("Purchase Done");
  }
);

const storeOrder = async (charge) => {
  const { package_name, userId, discount } = charge.metadata;
  const bookingExist = await bookData.findOneBy({
    tour: {
      package_name: package_name,
    },
    user: {
      id: +userId,
    },
    payment: false,
  });
  const roomBooking = await bookRoomData.findOneBy({
    room: {
      room_name: package_name,
    },
    user: {
      id: +userId,
    },
    payment: false,
  });
  if (bookingExist) {
    const tourOrder = new TourOrders();
    tourOrder.order_id = idempotencyKey;
    tourOrder.user = bookingExist.user;
    tourOrder.purchased_by = charge.customer_details.name;
    tourOrder.email = charge.customer_details.email;
    tourOrder.description = `Purchased ${bookingExist.tour.package_name}`;
    tourOrder.paymentStatus = true;
    tourOrder.discount = +discount;
    tourOrder.orderCost = charge.amount_total / 100;
    tourOrder.bookTour = bookingExist;
    tourOrder.paymentId = charge.payment_intent;
    tourOrder.orderStatus = true;
    tourOrder.orderdAt = new Date();
    await AppDataSource.manager.save(tourOrder);

    bookingExist.book_status = true;
    bookingExist.payment = true;

    await AppDataSource.manager.save(bookingExist);
  } else {
    const hotelOrder = new HotelOrders();
    hotelOrder.order_id = idempotencyKey;
    hotelOrder.paymentStatus = true;
    hotelOrder.paymentId = charge.payment_intent;
    hotelOrder.orderStatus = true;
    hotelOrder.orderdAt = new Date();
    hotelOrder.bookRoom = roomBooking;
    hotelOrder.discount = +discount;
    hotelOrder.user = roomBooking.user;
    hotelOrder.purchased_by = charge.customer_details.name;
    hotelOrder.email = charge.customer_details.email;
    hotelOrder.description = `Purchased ${roomBooking.room.room_name}`;
    hotelOrder.orderCost = charge.amount_total / 100;

    await hotelOrderData.save(hotelOrder);

    roomBooking.payment = true;
    await bookRoomData.save(roomBooking);
  }
};

export default router;
