import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import * as multer from "multer";
import * as YAML from "yamljs";
import * as swaggerUi from "swagger-ui-express";

import authRouter from "./router/authRouter";
import adminRouter from "./router/adminRouter";
import hotelRouter from "./router/hotelRouter";
import tourRouter from "./router/tourRouter";
import userRouter from "./router/userRouter";
import bookRouter from "./router/bookRouter";
import paymentRouter from "./router/paymentRouter";
import orderRouter from "./router/orderRouter";
import stripeController from "./controller/StripeWebHook";
import { checkRole } from "./MiddleWare/checkRole/checkRole";
import { verifyJWT } from "./MiddleWare/jwtToken/verifyJWT";
import path = require("path");
import morgan = require("morgan");

require("dotenv").config();
const app: express.Application = express();

const port: number = 8080 || +process.env.PORT;

const swaggerDocs = YAML.load(path.join(__dirname, "./swagger.yml"));
const options = {
  customSiteTitle: "Booking App Swagger Document",
  customCss: `
    .swagger-ui .topbar {
      display: none;
    }
    .swagger-ui .models {
      display: none;
    }`,
};

AppDataSource.initialize()
  .then(async () => {
    app.use(stripeController);

    app.use(morgan("combined"));
    app.use(express.static(__dirname));
    app.use(express.json());
    app.use(cors());

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs, options)
    );

    app.use(authRouter);

    app.use(userRouter);

    app.use("/hotel", checkRole, verifyJWT, hotelRouter);

    app.use("/tour", checkRole, verifyJWT, tourRouter);

    app.use("/admin", checkRole, verifyJWT, adminRouter);

    app.use(checkRole, verifyJWT, bookRouter);

    app.use(checkRole, verifyJWT, paymentRouter);

    app.use(checkRole, verifyJWT, orderRouter);

    app.use((req: express.Request, res: express.Response, next) => {
      console.log("Middle Ware");
      next();
    });

    app.listen(port, (): void => {
      console.log("Server Listening at " + port);
    });
  })
  .catch((error) => console.log(error));

//for testing uncomment this line
//module.exports = app.listen(8080);
