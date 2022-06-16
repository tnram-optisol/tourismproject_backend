import * as express from "express";
import { getAllTourOrders } from "../services/orderService";
import { addNewTour, getTours, updateTourData } from "../services/tourService";

export class TourController{
  addTour = async (req, res: express.Response, next) => {
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    if (userId > 0) {
      let tourExist = await getTours({
        package_name: req.body.name,
        user: req.body.user.id,
      });
      if (tourExist) {
        return res.status(400).json("Tour Exists");
      } else {
        let tour = {
          package_name: req.body.name,
          from: req.body.from,
          to: req.body.to,
          tour_image: "http://localhost:8080/uploads/" + req.file.filename,
          provider_license: req.body.license,
          description: req.body.description,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          total_days: req.body.days,
          cost: req.body.cost,
          user: req.body.user,
        };
        console.log(tour.user);
        await addNewTour(tour);
        return res.status(200).json("Saved Tour Data / Awaiting Confirmation");
      }
    }
    return res.status(400).json("No User Exists");
  };
  
  viewTours = async (req, res: express.Response, next) => {
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    if (userId > 0) {
      let totalTour = await getTours({
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
  
  tourPagination = async (req, res: express.Response, next) => {
    const ITEMS_PER_PAGE = 2;
    const take = ITEMS_PER_PAGE;
    //const skip= (take-1) > 1 ? (take-1):0
    const skip = (parseInt(req.params.take) - 1) * ITEMS_PER_PAGE;
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    let totalTour = await getTours({
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
  
  updateTour = async (req, res: express.Response, next) => {
    let roleId = parseInt(req.headers.role[0]);
    let name = req.body.name;
    let tourId = req.body.tourId;
    let tourExist = await getTours({
      package_name: req.body.name,
      user: {
        id: req.body.user,
      },
    });
    //update Request
    if (tourExist) {
      let myTour = await updateTourData(tourId, {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        tour_image: "http://localhost:8080/uploads/" + req.file.filename,
        description: req.body.description,
        cost: req.body.cost,
      });
      return res.status(200).json("Tour Data Updated");
    }
    return res.status(400).json("Not Found Tour");
  };
  
  getAdminTourOrders = async (req, res: express.Response, next) => {
    let roleId = parseInt(req.headers.role[0]);
    let name = req.body.name;
    let tourId = req.body.tourId;
    let tourExist = await getTours({
      package_name: req.body.name,
      user: {
        id: req.body.user,
      },
    });
    //update Request
    if (tourExist) {
      let myTour = await getAllTourOrders();
      return res.status(200).json(myTour);
    }
    return res.status(400).json("Not Found Tour");
  };
}
