import * as express from "express";
import { validationResult } from "express-validator";


import { TourService } from "../services/tourService";
import * as mailService from "../services/mailService";
import { BannerService } from "../services/bannerService";
import { AuthService } from "../services/authService";
import { AdminService } from "../services/adminService";
import { ReviewService } from "../services/reviewService";
import { CategoryService } from "../services/categoryService";
import { HotelService } from "../services/hotelService";

const authService = new AuthService();
const adminService = new AdminService();
const bannerService = new BannerService();
const reviewService = new ReviewService();
const tourService = new TourService();
const hotelService = new HotelService(); 
const categoryService = new CategoryService(); 

export class UserController {
  getAllTours = async (req, res: express.Response, next) => {
    let tourExist = await tourService.getTours({ status: true });
    if (tourExist) {
      return res.status(200).json(tourExist);
    }
    return res.status(400).json("No Tour Available");
  };

  getHomeTour = async (req, res: express.Response, next) => {
    let bannerExist = await bannerService.getAllBanner({
      where: {
        tour: {
          status: true,
        },
      },
      order: {
        sequence: "ASC",
      },
    });
    if (bannerExist) {
      return res.status(200).json(bannerExist);
    }
    return res.status(400).json("No Tour Available");
  };

  viewTour = async (req, res: express.Response, next) => {
    let tour_id = +req.params.id;
    let tourExist = await tourService.getTourById({ tour_id: tour_id });
    if (tourExist) {
      return res.status(200).json(tourExist);
    }
    return res.status(400).json("No Tour Available");
  };

  viewHotel = async (req, res: express.Response, next) => {
    let hotelExist = await hotelService.getHotels({ status: true });
    if (hotelExist) {
      return res.status(200).json(hotelExist);
    }
    return res.status(400).json("No Hotel Available");
  };

  viewAllRooms = async (req, res: express.Response, next) => {
    let hotelId = +req.params.id;
    let roomExist = await hotelService.getAllRooms({
      where: {
        hotel: {
          hotel_id: hotelId,
        },
      },
    });
    if (roomExist) {
      return res.status(200).json(roomExist);
    }
    return res.status(400).json("No Rooms Available");
  };

  viewRooms = async (req, res: express.Response, next) => {
    let roomId = +req.params.id;
    let roomExist = await hotelService.getRoomById({
      room_id: roomId,
    });
    if (roomExist) {
      return res.status(200).json(roomExist);
    }
    return res.status(400).json("No Rooms Available");
  };

  getCategory = async (req: express.Request, res: express.Response, next) => {
    const result = await categoryService.getAllCategory();
    return res.status(200).json(result);
  };

  searchTourData = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const location = req.params.location;
    const result = await categoryService.getCategoryLocation({
      category: location,
    });
    let categoryId = result.id;
    if (categoryId > 0) {
      let tourExist = await categoryService.getTourCategoryData(categoryId);
      if (tourExist) {
        return res.status(200).json(tourExist);
      }
    } else {
      let tourExist = await bannerService.getTourBanner("banner.tour", "tours");
      if (tourExist) {
        return res.status(200).json(tourExist);
      }
    }
  };

  paginateTour = async (req, res: express.Response, next) => {
    const ITEMS_PER_PAGE = 2;
    const take = ITEMS_PER_PAGE;
    //const skip= (take-1) > 1 ? (take-1):0
    const skip = (parseInt(req.params.take) - 1) * ITEMS_PER_PAGE;
    console.log(take, skip);
    let totalTour = await bannerService.getAllBanner({
      where: {
        tour: {
          status: true,
        },
      },
      take: take,
      skip: skip,
    });
    if (totalTour) {
      return res.status(200).json(totalTour);
    }
    return res.status(400).json("No Tour Available");
  };

  filterByCategory = async (req, res: express.Response, next) => {
    let categoryId = req.params.category;
    if (categoryId > 0) {
      let tourExist = await categoryService.getTourCategoryData(categoryId);
      if (tourExist) {
        return res.status(200).json(tourExist);
      }
    } else {
      let tourExist = await bannerService.getTourBanner("banner.tour", "tours");
      if (tourExist) {
        return res.status(200).json(tourExist);
      }
    }

    return res.status(400).json("No Tour Available");
  };

  sendMail = async (req: express.Request, res: express.Response, next) => {
    let mail = req.body.email;
    let name = req.body.name;
    let messageData = req.body.message;
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    await adminService.saveMail(name, mail, messageData);
    const message = {
      from: req.body.email,
      to: "admin@abc.com",
      subject: "Query Mail ",
      html: `<h1>${req.body.message}</h1>`,
    };
    mailService.transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Try Again");
      }
      return res.status(200).json("Mail Sent Successfully to admin");
    });
  };

  viewRating = async (req: express.Request, res: express.Response, next) => {
    const id = +req.params.id;
    const tourExist = await tourService.getTourById({ tour_id: id });
    const viewReview = await reviewService.getRating(id);
    if (viewReview) {
      return res.status(200).json(viewReview);
    }
    return res.status(200).json("No reviews Available");
  };

  viewReview = async (req: express.Request, res: express.Response, next) => {
    const id = +req.params.id;
    const tourExist = await tourService.getTourById({ tour_id: id });
    const viewReview = await reviewService.getReviewById(tourExist);
    if (viewReview) {
      return res.status(200).json(viewReview);
    }
    return res.status(200).json("No reviews Available");
  };

  postReview = async (req: express.Request, res: express.Response, next) => {
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }

    const tourExist = await tourService.getTourById({ tour_id: req.body.tour });

    if (!tourExist) {
      return res.status(400).json("Please Check Tour Id");
    }

    const name = req.body.name;
    const rating = req.body.rating;
    const review = req.body.comment;
    const tour = tourExist;
    const response = await reviewService.saveReview(name, rating, review, tour);

    return res.status(200).json("Review Posted Successfully");
  };

  viewProfile = async (req: express.Request, res: express.Response, next) => {
    const id = req.headers.user[0] ? +req.headers.user[0] : 0;
    if (id === 0) {
      return res.status(400).json("No Profile Exists");
    }
    const query = {
      id: id,
    };
    const userData = await authService.findUser(query);
    return res.status(200).json(userData);
  };
}
