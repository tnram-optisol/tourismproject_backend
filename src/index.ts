import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import * as multer from "multer";

import authcontroller from "./controller/AuthController";
import hotelController from "./controller/HotelController";
import adminController from "./controller/AdminController";
import tourController from "./controller/TourController";
import userController from "./controller/UserController";
import bookController from "./controller/BookingController";
import paymentController from "./controller/PaymentController";
import orderController from "./controller/OrderController";
import stripeController from "./controller/StripeWebHook";
import reviewController from "./controller/ReviewController";
import { authMiddleWare } from "./MiddleWare/authMiddleWare";
import { adminMiddleWare } from "./MiddleWare/adminMiddleWare";
import { tourMiddleWare } from "./MiddleWare/tourMiddleWare";
import { userMiddleWare } from "./MiddleWare/userMiddleWare";

require("dotenv").config();

AppDataSource.initialize()
  .then(async () => {
    const app: express.Application = express();

    const port: number = 8080 || +process.env.PORT;

    app.use(stripeController);

    app.use(express.static(__dirname));
    app.use(express.json());
    app.use(cors());

    app.use(authcontroller);

    app.use(userController);

    app.use(reviewController);

    app.use(authMiddleWare, hotelController);

    app.use(tourMiddleWare, tourController);

    app.use(adminMiddleWare, adminController);

    app.use(userMiddleWare, bookController);

    app.use(userMiddleWare, paymentController);

    app.use(userMiddleWare, orderController);

    app.use((req: express.Request, res: express.Response, next) => {
      console.log("Middle Ware");
      next();
    });

    app.listen(port, (): void => {
      console.log("Server Listening at " + port);
    });
  })
  .catch((error) => console.log(error));
