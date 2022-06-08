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
import { checkRole } from "./MiddleWare/checkRole/checkRole";
import { verifyJWT } from "./MiddleWare/jwtToken/verifyJWT";

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

    app.use("/hotel", checkRole, verifyJWT, hotelController);

    app.use("/tour", checkRole, verifyJWT, tourController);

    app.use("/admin", checkRole, verifyJWT, adminController);

    app.use(checkRole, verifyJWT, bookController);

    app.use(checkRole, verifyJWT, paymentController);

    app.use(checkRole, verifyJWT, orderController);

    app.use((req: express.Request, res: express.Response, next) => {
      console.log("Middle Ware");
      next();
    });

    app.listen(port, (): void => {
      console.log("Server Listening at " + port);
    });
  })
  .catch((error) => console.log(error));
