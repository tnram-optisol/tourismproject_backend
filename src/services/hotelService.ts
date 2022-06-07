import * as express from "express";
import { AppDataSource } from "../data-source";
import { Hotels } from "../entity/Hotels";
import { Requests } from "../entity/Requests";
import { Rooms } from "../entity/Rooms";

const hotelData = AppDataSource.getRepository(Hotels);
const requestData = AppDataSource.getRepository("requests");
const roomData = AppDataSource.getRepository(Rooms);

export const addHotel = async (req, res: express.Response, next) => {
    let roleId = parseInt(req.headers.role[0]);
    let hotelExist = await hotelData.findOneBy({
      hotel_name: req.body.hotel.name,
      user: req.body.hotel.user.id,
    });
  
    if (hotelExist) {
      return res.status(400).json(hotelExist);
      next();
    } else {
      let hotel = new Hotels();
      hotel.hotel_name = req.body.hotel.name;
      hotel.latitude = req.body.hotel.latitude;
      hotel.longitude = req.body.hotel.longitude;
      hotel.address = req.body.hotel.address;
      hotel.hotel_license = req.body.hotel.license;
      hotel.hotel_image = req.body.hotel.image;
      hotel.user = req.body.hotel.user.id;
      hotel.status = false;
      console.log(hotel.user);
      await AppDataSource.manager.save(hotel);
  
      let request = new Requests();
      request.status = false;
      request.user = hotel.user;
      await AppDataSource.manager.save(request);
  
      res.status(200).json("Saved Data / Awaiting Confirmation");
    }
}

export const viewHotel = async (req, res: express.Response, next) => {
    let userId = req.headers.user[0];
    let hotelExist = await hotelData.findBy(
        {
            user:{
                id:parseInt(userId)
            }
        }
    );
    if (hotelExist) {
      return res.status(200).json(hotelExist);
    }
    return res.status(400).json("No Hotel Available");
}

export const addRooms = async (req, res: express.Response, next) => {
    let roleId = parseInt(req.headers.role[0]);
    const newRoom = new Rooms();
    newRoom.room_name = req.body.room.name;
    newRoom.availablity = true;
    newRoom.description = req.body.room.description;
    newRoom.room_image = req.body.room.image;
    newRoom.room_price = req.body.room.price;
    newRoom.max_person = req.body.room.maxPerson;
    newRoom.hotel = req.body.room.hotel_id;
    await roomData.save(newRoom);
    res.status(200).json("Saved Successfull");
}

export const getAllRooms = async (req, res: express.Response, next) => {
    let hotelId = +req.params.id
    let userId = req.headers.user[0] ? parseInt(req.headers.user[0]) : 0;
    let roomExist = await roomData.find({
        where:{
            hotel:{
                hotel_id:hotelId
            }
        }
    });
    if (roomExist) {
      return res.status(200).json(roomExist);
    }
    return res.status(400).json("No Rooms Available");
}