import * as express from "express";
import { validationResult } from "express-validator";
import { CATEGORY } from "../constants/db.constants";
import { findAllUser, getAllRequests } from "../services/adminService";
import {
  getAllBanner,
  getBannerById,
  getSequence,
  saveBanner,
  updateBanner,
} from "../services/bannerService";
import {
  addCategory,
  getAllCategory,
  removeCategory,
  updateCategory,
} from "../services/categoryService";
import { hotelRequests, updateHotelStatus } from "../services/hotelService";
import { getAllHotelOrders, getAllTourOrders } from "../services/orderService";
import { tourRequests, updateTourData } from "../services/tourService";

export class AdminController {
  viewAllRequests = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    let requests = await getAllRequests({ status: false });
    let role = parseInt(req.headers.role[1]);
    if (requests) {
      let hotel = await hotelRequests({ status: false });
      let tour = await tourRequests({ status: false });
      return res.status(200).json({ hotel, tour });
    }
    return res.status(400).json("Not Found Any Requests");
  };

  viewAllBanner = async (req: express.Request, res: express.Response, next) => {
    let banners = await getAllBanner({});
    let role = parseInt(req.headers.role[1]);
    console.log("running");
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
    const result = await getAllCategory();
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
    const result = await findAllUser();
    return res.status(200).json(result);
  };

  adminAllOrders = async (
    req: express.Request,
    res: express.Response,
    next
  ) => {
    const tourOrder = await getAllTourOrders();
    const hotelOrder = await getAllHotelOrders();
    if (tourOrder || hotelOrder) {
      return res.status(200).json([...tourOrder, ...hotelOrder]);
    }
    return res.status(401).json("No Orders Exists");
  };
}
