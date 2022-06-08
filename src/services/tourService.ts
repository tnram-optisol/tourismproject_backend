import * as express from "express";
import {
  REQUEST,
  REQUEST_DATA,
  TOUR,
  TOUR_DATA,
  TOUR_ORDER_DATA,
} from "../constants/db.constants";

export const addTour = async (req, res: express.Response, next) => {
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  if (userId > 0) {
    let tourExist = await TOUR_DATA.findOneBy({
      package_name: req.body.name,
      user: req.body.user.id,
    });
    if (tourExist) {
      return res.status(400).json("Tour Exists");
    } else {
      let tour = TOUR;
      tour.package_name = req.body.name;
      tour.from = req.body.from;
      tour.to = req.body.to;
      tour.tour_image = "http://localhost:8080/uploads/" + req.file.filename;
      tour.provider_license = req.body.license;
      tour.description = req.body.description;
      tour.availablity = true;
      tour.status = false;
      tour.startDate = req.body.startDate;
      tour.endDate = req.body.endDate;
      tour.total_days = req.body.days;
      tour.max_person = 100;
      tour.cost = req.body.cost;
      tour.user = req.body.user;

      console.log(tour.user);
      await TOUR_DATA.manager.save(tour);
      let request = REQUEST;
      request.status = false;
      request.user = tour.user;
      await REQUEST_DATA.manager.save(request);
      return res.status(200).json("Saved Tour Data / Awaiting Confirmation");
    }
  }
  return res.status(400).json("No User Exists");
};

export const viewTours = async (req, res: express.Response, next) => {
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  if (userId > 0) {
    let totalTour = await TOUR_DATA.findBy({
      user: {
        id: userId,
      },
    });
    if (totalTour) {
      return res.status(200).json(totalTour);
    }
    return res.status(400).json("No Tour Available");
  }
  return res.status(400).json("No Tour Available");
};

export const updateTour = async (req, res: express.Response, next) => {
  let roleId = parseInt(req.headers.role[0]);
  let name = req.body.name;
  let tourId = req.body.tourId;
  let tourExist = await TOUR_DATA.findOneBy({
    package_name: req.body.name,
    user: {
      id: req.body.user,
    },
  });
  //update Request
  if (tourExist) {
    let myTour = await TOUR_DATA.update(tourId, {
      startDate: new Date(req.body.startDate).toLocaleDateString(),
      endDate: new Date(req.body.endDate).toLocaleDateString(),
      tour_image: "http://localhost:8080/uploads/" + req.file.filename,
      description: req.body.description,
      cost: req.body.cost,
    });
    return res.status(200).json("Tour Data Updated");
  }
  return res.status(400).json("Not Found Tour");
};

export const tourPaginate = async (req, res: express.Response, next) => {
  const ITEMS_PER_PAGE = 2;
  const take = ITEMS_PER_PAGE;
  //const skip= (take-1) > 1 ? (take-1):0
  const skip = (parseInt(req.params.take) - 1) * ITEMS_PER_PAGE;
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  let totalTour = await TOUR_DATA.find({
    where: {
      user: {
        id: userId,
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

export const getAllOrders = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let tourOrderExist = await TOUR_ORDER_DATA.find({
    order: {
      orderdAt: "DESC",
    },
  });
  if (tourOrderExist) {
    return res.status(200).json(tourOrderExist);
  }
  return res.status(400).json("No Orders Exists...");
};
