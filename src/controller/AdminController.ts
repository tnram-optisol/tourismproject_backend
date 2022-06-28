import * as express from "express";
import { validationResult } from "express-validator";
import { findAllUser, getAllRequests } from "../services/adminService";
import {
  getAdminBannerData,
  getBannerById,
  getSequence,
  saveBanner,
  updateBanner,
} from "../services/bannerService";
import {
  addCategory,
  getAdminCategoryData,
  removeCategory,
  updateCategory,
} from "../services/categoryService";
import { hotelRequests, updateHotelStatus } from "../services/hotelService";
import {
  discardNotification,
  getAllNotification,
} from "../services/notificationService";
import { getAllHotelOrders, getAllTourOrders } from "../services/orderService";
import { tourRequests, updateTourData } from "../services/tourService";

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
    let requests = await getAllRequests({ status: false });
    let role = parseInt(req.headers.role[1]);
    if (requests) {
      let hotel = await hotelRequests(limit, skip, search);
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
    let requests = await getAllRequests({ status: false });
    let role = parseInt(req.headers.role[1]);
    if (requests) {
      let tour = await tourRequests(limit, skip, search);
      return res.status(200).json({ tour });
    }
    return res.status(400).json("Not Found Any Requests");
  };
  viewAllBanner = async (req: express.Request, res: express.Response, next) => {
    const limit = req.query.limit ? +req.query.limit : 0;
    const page = req.query.page ? +req.query.page : 0;
    const skip = page * limit;
    const search = req.query.search ? req.query.search : "";
    let banners = await getAdminBannerData(limit, skip, search);
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
    let sequence = await getSequence("MAX(banner.sequence)", "max");
    if (role === 2) {
      let result = await updateHotelStatus(property, { status: status });
      return res.status(200).json(result);
    } else if (role === 3) {
      let result = await updateTourData(property, { status: status });
      await saveBanner(property, sequence.max + 1);
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
    let banners = await getBannerById({
      tour: {
        tour_id: tourId,
      },
    });
    if (banners) {
      banners.sequence = +req.body.sequence;
      await updateBanner(banners);
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
    let result = await addCategory(name, image);
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
    const result = await updateCategory(package_name, category, closed_on);
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
    const result = await getAdminCategoryData(limit, skip, search);
    return res.status(200).json(result);
  };

  deleteCategory = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const category_id = +req.params.id;
    const result = await removeCategory({
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
    const result = await findAllUser(search, limit, skip);
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
    const notification = await getAllNotification();
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
    const notification = await discardNotification(id);
    if (notification) {
      return res.status(200).json({ notification });
    }
    return res.status(401).json("No Orders Exists");
  };
}
