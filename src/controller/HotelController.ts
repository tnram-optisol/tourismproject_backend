import * as express from "express";
import {
  addNewHotel,
  addNewRoom,
  getAllRooms,
  getHotels,
} from "../services/hotelService";

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
    name: req.body.room.name,
    description: req.body.room.description,
    image: req.body.room.image,
    cost: req.body.room.cost,
    maxPerson: req.body.room.maxPerson,
    hotel_id: req.body.room.hotel_id,
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
      name: req.body.hotel.name,
      latitude: req.body.hotel.latitude,
      longitude: req.body.hotel.longitude,
      address: req.body.hotel.address,
      license: req.body.hotel.license,
      image: req.body.hotel.image,
      user: req.body.hotel.user.id,
    };
    await addNewHotel(hotel);

    res.status(200).json("Saved Hotel Data / Awaiting Confirmation");
  }
};
