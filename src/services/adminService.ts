import * as express from "express";
import { AppDataSource } from "../data-source";
import { Banner } from "../entity/Banner";
import { Category } from "../entity/Category";
import { Hotels } from "../entity/Hotels";
import { Requests } from "../entity/Requests";
import { TourCategory } from "../entity/TourCategory";
import { Tours } from "../entity/Tours";

const requestData = AppDataSource.getRepository(Requests);
const hotelData = AppDataSource.getRepository(Hotels);
const tourData = AppDataSource.getRepository(Tours);
const bannerData = AppDataSource.getRepository(Banner);
const categoryData = AppDataSource.getRepository(Category);
const tourCategory = AppDataSource.getRepository(TourCategory)

export const getAllRequests = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let requests = await requestData.findBy({ status: false });
  let role = parseInt(req.headers.role[1]);
  if (requests) {
    let hotel = await hotelData.findBy({ status: false });
    let tour = await tourData.findBy({ status: false });
    return res.status(200).json({ hotel, tour });
  }
  return res.status(400).json("Not Found Any Requests");
};

export const adminApproval = async (req, res: express.Response, next) => {
  let user = req.body.user;
  let role = req.body.role;
  let status = req.body.status;
  let property = req.body.property;
  let sequence = await bannerData
    .createQueryBuilder("banner")
    .select("MAX(banner.sequence)", "max")
    .getRawOne();
  if (role === 2) {
    let result = await hotelData.update(property, { status: status });
    return res.status(200).json(result);
  } else if (role === 3) {
    let result = await tourData.update(property, { status: status });
    const newBanner = new Banner();
    newBanner.tour = property;
    newBanner.sequence = sequence.max + 1;
    await bannerData.save(newBanner);
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
  let banners = await bannerData.find();
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
  let banners = await bannerData.findOneBy({
    tour: {
      tour_id: tourId,
    },
  });
  if (banners) {
    banners.sequence = +req.body.sequence;
    await bannerData.save(banners);
    return res.status(200).json(banners);
  }
  return res.status(400).json("Not Found Any Requests");
};

export const addCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let name = req.body.category.category_name;
  let image = req.body.category.category_image;
  let newCategory = new Category();
  newCategory.image = image;
  newCategory.category = name;
  let result = await categoryData.save(newCategory);
  return res.status(200).json(result);
};

export const getCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const result = await categoryData.find();
  return res.status(200).json(result);
};

export const updateTourCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let newCategory = new TourCategory();
  newCategory.tour = req.body.tour.tour;
  newCategory.category = req.body.tour.category;
  newCategory.closed_on = new Date(req.body.tour.closedOn);
  await tourCategory.save(newCategory);
  return res.status(200).json("Data Updated")
};
