import * as express from "express";
import { CATEGORY } from "../constants/db.constants";
import { getAllRequests } from "../services/adminService";
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
import { tourRequests, updateTourData } from "../services/tourService";

export const viewAllRequests = async (
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

export const viewAllBanner = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let banners = await getAllBanner({});
  let role = parseInt(req.headers.role[1]);
  console.log("running");
  if (banners) {
    return res.status(200).json(banners);
  }
  return res.status(400).json("Not Found Any Requests");
};

export const adminApproval = async (req, res: express.Response, next) => {
  let user = req.body.user;
  let role = req.body.role;
  let status = req.body.status;
  let property = req.body.property;
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

export const storeSequence = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let tourId = req.body.tourId;
  let role = parseInt(req.headers.role[1]);
  console.log("running");
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

export const saveCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let name = req.body.category_name;
  let image = "http://localhost:8080/uploads/" + req.file.filename;
  let result = await addCategory(name, image);
  return res.status(200).json(result);
};

export const updateTourCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let package_name = req.body.tour.tour;
  let category = req.body.tour.category;
  let closed_on = new Date(req.body.tour.closedOn);
  await updateCategory(package_name, category, closed_on);
  return res.status(200).json("Data Updated");
};

export const viewAllCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const result = await getAllCategory();
  return res.status(200).json(result);
};

export const deleteCategory = async (
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
