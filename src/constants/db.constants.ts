import { AppDataSource } from "../data-source";
import { AdminMail } from "../entity/AdminMail";
import { Banner } from "../entity/Banner";
import { BookRoom } from "../entity/BookRoom";
import { BookTour } from "../entity/BookTour";
import { Category } from "../entity/Category";
import { HotelOrders } from "../entity/HotelOrders";
import { Hotels } from "../entity/Hotels";
import { Requests } from "../entity/Requests";
import { Roles } from "../entity/Roles";
import { Rooms } from "../entity/Rooms";
import { TourCategory } from "../entity/TourCategory";
import { TourOrders } from "../entity/TourOrders";
import { TourReview } from "../entity/TourReview";
import { Tours } from "../entity/Tours";
import { Users } from "../entity/User";

export const USER_DATA = AppDataSource.getRepository(Users)
export const ROLE_DATA = AppDataSource.getRepository(Roles)
export const REQUEST_DATA = AppDataSource.getRepository(Requests);
export const HOTEL_DATA = AppDataSource.getRepository(Hotels);
export const TOUR_DATA = AppDataSource.getRepository(Tours);
export const BANNER_DATA = AppDataSource.getRepository(Banner);
export const CATEGORY_DATA = AppDataSource.getRepository(Category);
export const TOUR_CATEGORY_DATA = AppDataSource.getRepository(TourCategory);
export const BOOK_TOUR_DATA = AppDataSource.getRepository(BookTour);
export const BOOK_ROOM_DATA = AppDataSource.getRepository(BookRoom);
export const TOUR_ORDER_DATA = AppDataSource.getRepository(TourOrders);
export const HOTEL_ORDER_DATA = AppDataSource.getRepository(HotelOrders);
export const ROOM_DATA = AppDataSource.getRepository(Rooms);
export const TOUR_REVIEW_DATA = AppDataSource.getRepository(TourReview);
export const ADMIN_MAIL_DATA = AppDataSource.getRepository(AdminMail);

export const BANNER = new Banner();
export const CATEGORY = new Category();
export const TOURCATEGORY = new TourCategory();
export const BOOKTOUR = new BookTour();
export const BOOKROOM = new BookRoom();
export const TOURODER = new TourOrders();
export const HOTEL = new Hotels();
export const ROOM = new Rooms();
export const TOUR = new Tours();
export const REQUEST = new Requests();
export const TOUR_REVIEW = new TourReview();
export const ADMIN_MAIL = new AdminMail()