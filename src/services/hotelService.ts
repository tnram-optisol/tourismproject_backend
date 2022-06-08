import * as express from "express";
import {
  HOTEL,
  HOTEL_DATA,
  REQUEST,
  ROOM,
  ROOM_DATA,
} from "../constants/db.constants";

export const addHotel = async (req, res: express.Response, next) => {
  let roleId = parseInt(req.headers.role[0]);
  let hotelExist = await HOTEL_DATA.findOneBy({
    hotel_name: req.body.hotel.name,
    user: req.body.hotel.user.id,
  });

  if (hotelExist) {
    return res.status(400).json(hotelExist);
    next();
  } else {
    let hotel = HOTEL;
    hotel.hotel_name = req.body.hotel.name;
    hotel.latitude = req.body.hotel.latitude;
    hotel.longitude = req.body.hotel.longitude;
    hotel.address = req.body.hotel.address;
    hotel.hotel_license = req.body.hotel.license;
    hotel.hotel_image = req.body.hotel.image;
    hotel.user = req.body.hotel.user.id;
    hotel.status = false;
    console.log(hotel.user);
    await HOTEL_DATA.manager.save(hotel);

    let request = REQUEST;
    request.status = false;
    request.user = hotel.user;
    await HOTEL_DATA.manager.save(request);

    res.status(200).json("Saved Hotel Data / Awaiting Confirmation");
  }
};

export const viewHotel = async (req, res: express.Response, next) => {
  let userId = req.headers.user[0];
  let hotelExist = await HOTEL_DATA.findBy({
    user: {
      id: parseInt(userId),
    },
  });
  if (hotelExist) {
    return res.status(200).json(hotelExist);
  }
  return res.status(400).json("No Hotel Available");
};

export const addRooms = async (req, res: express.Response, next) => {
  let roleId = parseInt(req.headers.role[0]);
  const newRoom = ROOM;
  newRoom.room_name = req.body.room.name;
  newRoom.availablity = true;
  newRoom.description = req.body.room.description;
  newRoom.room_image = req.body.room.image;
  newRoom.room_price = req.body.room.cost;
  newRoom.max_person = req.body.room.maxPerson;
  newRoom.hotel = req.body.room.hotel_id;
  await ROOM_DATA.save(newRoom);
  res.status(200).json("Saved Successfull");
};

export const getAllRooms = async (req, res: express.Response, next) => {
  let hotelId = +req.params.id;
  let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
  let roomExist = await ROOM_DATA.find({
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
