import * as express from "express";
import {
  addNewHotel,
  addNewRoom,
  getAllRooms,
  getHotels,
} from "../services/hotelService";
import { getAllHotelOrders } from "../services/orderService";

export const viewHotel = async (req, res: express.Response, next) => {
  let userId = req.headers.user[0];
  let hotelExist = await getHotels({
    user: {
      id: parseInt(userId),
    },
  });
  if (hotelExist) {
    return res.status(200).json(hotelExist);
  }
  return res.status(400).json("No Hotel Available");
};

export const viewAllRooms = async (req, res: express.Response, next) => {
  let hotelId = +req.params.id;
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  let roomExist = await getAllRooms({
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

export const addRooms = async (req, res: express.Response, next) => {
  let roleId = parseInt(req.headers.role[0]);
  let room = {
    name: req.body.name,
    description: req.body.description,
    image: "http://localhost:8080/uploads/" + req.file.filename,
    cost: req.body.cost,
    maxPerson: req.body.maxPerson,
    hotel_id: req.body.hotel_id,
  };

  await addNewRoom(room);
  res.status(200).json("Saved Successfull");
};

export const addHotel = async (req, res: express.Response, next) => {
  let roleId = parseInt(req.headers.role[0]);
  let hotelExist = await getHotels({
    hotel_name: req.body.hotel.name,
    user: req.body.hotel.user.id,
  });

  if (hotelExist) {
    return res.status(400).json(hotelExist);
    next();
  } else {
    let hotel = {
      name: req.body.name,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      address: req.body.address,
      license: req.body.license,
      image: "http://localhost:8080/uploads/" + req.file.filename,
      user: req.body.user.id,
    };
    await addNewHotel(hotel);

    res.status(200).json("Saved Hotel Data / Awaiting Confirmation");
  }
};

export const hotelAdminAllOrders = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const roleId = +req.headers.role[0];
  let hotelOrderExist = await getAllHotelOrders();
    if (hotelOrderExist) {
      return res.status(200).json(hotelOrderExist);
    }
  return res.status(400).json("No Orders Exists...");
};