import * as express from "express";
import {
  BANNER,
  BANNER_DATA,
  CATEGORY,
  CATEGORY_DATA,
  HOTEL_DATA,
  REQUEST_DATA,
  TOURCATEGORY,
  TOUR_CATEGORY_DATA,
  TOUR_DATA,
} from "../constants/db.constants";

export const getAllRequests = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let requests = await REQUEST_DATA.findBy({ status: false });
  let role = parseInt(req.headers.role[1]);
  if (requests) {
    let hotel = await HOTEL_DATA.findBy({ status: false });
    let tour = await TOUR_DATA.findBy({ status: false });
    return res.status(200).json({ hotel, tour });
  }
  return res.status(400).json("Not Found Any Requests");
};

export const adminApproval = async (req, res: express.Response, next) => {
  let user = req.body.user;
  let role = req.body.role;
  let status = req.body.status;
  let property = req.body.property;
  let sequence = await BANNER_DATA.createQueryBuilder("banner")
    .select("MAX(banner.sequence)", "max")
    .getRawOne();
  if (role === 2) {
    let result = await HOTEL_DATA.update(property, { status: status });
    return res.status(200).json(result);
  } else if (role === 3) {
    let result = await TOUR_DATA.update(property, { status: status });
    const newBanner = BANNER;
    newBanner.tour = property;
    newBanner.sequence = sequence.max + 1;
    await BANNER_DATA.save(newBanner);
    return res.status(200).json(result);
  } else {
    return res.status(400).json("Not Found Users Requests");
  }
};

export const getAllBanner = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let banners = await BANNER_DATA.find();
  let role = parseInt(req.headers.role[1]);
  console.log("running");
  if (banners) {
    return res.status(200).json(banners);
  }
  return res.status(400).json("Not Found Any Requests");
};

export const storeSequence = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let tourId = req.body.tourId;
  let role = parseInt(req.headers.role[1]);
  console.log("running");
  let banners = await BANNER_DATA.findOneBy({
    tour: {
      tour_id: tourId,
    },
  });
  if (banners) {
    banners.sequence = +req.body.sequence;
    await BANNER_DATA.save(banners);
    return res.status(200).json(banners);
  }
  return res.status(400).json("Not Found Any Requests");
};

export const addCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let name = req.body.category_name;
  let image = "http://localhost:8080/uploads/" + req.file.filename;
  let newCategory = CATEGORY;
  newCategory.image = image;
  newCategory.category = name;
  let result = await CATEGORY_DATA.save(newCategory);
  return res.status(200).json(result);
};

export const getCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const result = await CATEGORY_DATA.find();
  return res.status(200).json(result);
};

export const updateTourCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let newCategory = TOURCATEGORY;
  newCategory.tour = req.body.tour.tour;
  newCategory.category = req.body.tour.category;
  newCategory.closed_on = new Date(req.body.tour.closedOn);
  await TOUR_CATEGORY_DATA.save(newCategory);
  return res.status(200).json("Data Updated");
};

export const deleteCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const category_id = +req.params.id;
  const result = await CATEGORY_DATA.delete({
    id: category_id,
  });
  return res.status(200).json(result);
};
