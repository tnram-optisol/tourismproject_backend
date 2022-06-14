import "reflect-metadata"
import { DataSource } from "typeorm"
require("dotenv").config();

import { AdminMail } from "./entity/AdminMail"
import { Banner } from "./entity/Banner"
import { BookRoom } from "./entity/BookRoom"
import { BookTour } from "./entity/BookTour"
import { Category } from "./entity/Category"
import { HotelOrders } from "./entity/HotelOrders"
import { Hotels } from "./entity/Hotels"
import { Requests } from "./entity/Requests"
import { Roles } from "./entity/Roles"
import { Rooms } from "./entity/Rooms"
import { TourCategory } from "./entity/TourCategory"
import { TourOrders } from "./entity/TourOrders"
import { TourReview } from "./entity/TourReview"
import { Tours } from "./entity/Tours"
import { Users } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: +process.env.POSTGRES_PORT,
    password: `${process.env.POSTGRES_PASSWORD}`,
    username: `${process.env.POSTGRES_USER}`,
    database: `${process.env.POSTGRES_DB}`,
    synchronize: true,
    logging: false,
    entities: [Users, Roles, Hotels, Rooms, Requests, Tours, BookTour, BookRoom, TourOrders, HotelOrders, TourReview, AdminMail, Banner, Category, TourCategory],
    migrations: [],
    subscribers: [],
})

