import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";
import {
  HOTEL,
  HOTEL_DATA,
  REQUEST,
  REQUEST_DATA,
  ROOM,
  ROOM_DATA,
} from "../constants/db.constants";



export class HotelService {
  hotelRequests = async (limit: number, skip: number, search?: any) => {
    if (search === "") {
      const resultData = await HOTEL_DATA.findAndCount({
        where: {
          status: false,
        },
        take: limit,
        skip: skip,
      });
      if (resultData[1] > 0) {
        return resultData;
      }
      return null;
    }
    const resultData = await HOTEL_DATA.createQueryBuilder("hotel")
      .innerJoinAndSelect("hotel.user", "user")
      .innerJoinAndSelect("user.role", "role")
      .where(
        "hotel.hotel_name ILIKE :q or hotel.hotel_license ILIKE :q or user.name ILIKE :q",
        {
          q: `%${search}%`,
        }
      )
      .where("hotel.status =:status", { status: false })
      .getMany();
    if (resultData.length > 0) {
      return resultData;
    }
    return null;
  };

  updateHotelStatus = async (id: number, query) => {
    const resultData = await HOTEL_DATA.update(id, query);
    return resultData;
  };

  getHotels = async (query) => {
    const resultData = await HOTEL_DATA.findBy(query);
    return resultData;
  };

  getAllRooms = async (query) => {
    const resultData = await ROOM_DATA.find(query);
    return resultData;
  };

  addNewRoom = async (room) => {
    const newRoom = ROOM;
    newRoom.room_name = room.name;
    newRoom.availablity = true;
    newRoom.description = room.description;
    newRoom.room_image = room.image;
    newRoom.room_price = room.cost;
    newRoom.max_person = room.maxPerson;
    newRoom.hotel = room.hotel_id;
    await ROOM_DATA.save(newRoom);
  };

  addNewHotel = async (hotelData) => {
    let hotel = HOTEL;
    hotel.hotel_name = hotelData.name;
    hotel.latitude = hotelData.latitude;
    hotel.longitude = hotelData.longitude;
    hotel.address = hotelData.address;
    hotel.hotel_license = hotelData.license;
    hotel.hotel_image = hotelData.image;
    hotel.user = hotelData.user.id;
    hotel.status = false;
    console.log(hotel.user);
    await HOTEL_DATA.save(hotel);

    const message = `${hotel.user.name} has raised request to add ${hotel.hotel_name}`;
    const type = "request_hotel";
    const newNotification = new Notification();
    newNotification.notification = message;
    newNotification.type = type;
    await AppDataSource.manager.save(newNotification);

    const request = REQUEST;
    request.status = false;
    request.user = hotel.user;
    await REQUEST_DATA.save(request);
  };

  getRoomById = async (query) => {
    const resultData = await ROOM_DATA.findOneBy(query);
    return resultData;
  };
}
