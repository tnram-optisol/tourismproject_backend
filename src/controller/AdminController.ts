import * as express from "express";
import { validationResult } from "express-validator";

import { AdminService } from "../services/adminService";
import { BannerService } from "../services/bannerService";
import { CategoryService } from "../services/categoryService";
import {
  addCouponsData,
  getCouponsData,
  removeCoupon,
} from "../services/couponService";
import { HotelService } from "../services/hotelService";
import { NotificationService } from "../services/notificationService";
import { getAllHotelOrders, getAllTourOrders } from "../services/orderService";
import { TourService } from "../services/tourService";

const adminService = new AdminService();
const notificationService = new NotificationService();
const bannerService = new BannerService();
const tourService = new TourService();
const hotelService = new HotelService();
const categoryService = new CategoryService();

export class AdminController {
  viewAllHotelRequests = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    let requests = await adminService.getAllRequests({ status: false });
    let role = parseInt(req.headers.role[1]);
    let hotel = await hotelService.hotelRequests(limit, skip, search);
    if (hotel) {
      return res.status(200).json({ hotel });
    }
    return res.status(400).json("Not Found Any Requests");
  };
  viewAllTourRequests = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    let requests = await adminService.getAllRequests({ status: false });
    let role = parseInt(req.headers.role[1]);
    let tour = await tourService.tourRequests(limit, skip, search);
    if (tour) {
      return res.status(200).json({ tour });
    }
    return res.status(400).json("Not Found Any Requests");
  };
  viewAllBanner = async (req: express.Request, res: express.Response, next) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    let banners = await bannerService.getAdminBannerData(limit, skip, search);
    let role = parseInt(req.headers.role[1]);
    if (banners) {
      return res.status(200).json(banners);
    }
    return res.status(400).json("Not Found Any Requests");
  };

  adminApproval = async (req, res: express.Response, next) => {
    let user = req.body.user;
    let role = req.body.role;
    let status = req.body.status;
    let property = req.body.property;
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    let sequence = await bannerService.getSequence(
      "MAX(banner.sequence)",
      "max"
    );
    if (role === 2) {
      let result = await hotelService.updateHotelStatus(property, {
        status: status,
      });
      return res.status(200).json(result);
    } else if (role === 3) {
      let result = await tourService.updateTourData(property, {
        status: status,
      });
      await bannerService.saveBanner(property, sequence.max + 1);
      return res.status(200).json(result);
    } else {
      return res.status(400).json("Not Found Users Requests");
    }
  };

  storeSequence = async (req: express.Request, res: express.Response, next) => {
    let tourId = req.body.tourId;
    let role = parseInt(req.headers.role[1]);
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    let banners = await bannerService.getBannerById({
      tour: {
        tour_id: tourId,
      },
    });
    if (banners) {
      banners.sequence = +req.body.sequence;
      await bannerService.updateBanner(banners);
      return res.status(200).json(banners);
    }
    return res.status(400).json("Not Found Any Requests");
  };

  saveCategory = async (req: express.Request, res: express.Response, next) => {
    const fileType = ["image/jpg", "image/png", "image/jpeg"];
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    if (fileType.findIndex((e) => e === req.file.mimetype) === -1) {
      return res
        .status(400)
        .send("Upload a image file with jpg /jpeg/png extensions");
    }
    let name = req.body.category_name;
    let image = "http://localhost:8080/uploads/" + req.file.filename;
    let result = await categoryService.addCategory(name, image);
    return res.status(200).json(result);
  };

  updateTourCategory = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    let package_name = req.body.tour.tour;
    let category = req.body.tour.category;
    let closed_on = new Date(req.body.tour.closedOn);
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    const result = await categoryService.updateCategory(
      package_name,
      category,
      closed_on
    );
    return res.status(200).json("Data Updated");
  };

  viewAllCategory = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    const result = await categoryService.getAdminCategoryData(
      limit,
      skip,
      search
    );
    return res.status(200).json(result);
  };

  deleteCategory = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const category_id = +req.params.id;
    const result = await categoryService.removeCategory({
      id: category_id,
    });
    return res.status(200).json(result);
  };

  getAllUsers = async (req: express.Request, res: express.Response, next) => {
    const category_id = +req.params.id;
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    const result = await adminService.findAllUser(search, limit, skip);
    return res.status(200).json(result);
  };

  adminAllTourOrders = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    const tourOrder = await getAllTourOrders(limit, skip, search);
    if (tourOrder) {
      return res.status(200).json({ tourOrder });
    }
    return res.status(401).json("No Orders Exists");
  };
  adminAllHotelOrders = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    const hotelOrder = await getAllHotelOrders(limit, skip, search);
    if (hotelOrder) {
      return res.status(200).json({ hotelOrder });
    }
    return res.status(401).json("No Orders Exists");
  };
  adminAllNotifications = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const notification = await notificationService.getAllNotification();
    if (notification) {
      return res.status(200).json({ notification });
    }
    return res.status(401).json("No Orders Exists");
  };
  deleteNotification = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const id = +req.params.id;
    const notification = await notificationService.discardNotification(id);
    if (notification) {
      return res.status(200).json({ notification });
    }
    return res.status(401).json("No Orders Exists");
  };

  getAllCoupon = async (req: express.Request, res: express.Response, next) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    const coupons = await getCouponsData(limit, skip, search);
    if (coupons) {
      return res.status(200).json({ coupons });
    }
    return res.status(401).json("No Coupons Exists");
  };

  saveNewCoupon = async (req: express.Request, res: express.Response, next) => {
    const coupon = {
      coupon_name: req.body.coupon,
      percent_off: +req.body.percent,
    };
    const result = await addCouponsData(coupon);
    return res.status(200).json("Coupon Added");
  };

  deleteCoupon = async (req: express.Request, res: express.Response, next) => {
    const coupon_id = +req.params.id;
    const result = await removeCoupon(coupon_id);
    return res.status(200).json("Coupon Removed");
  };
}
