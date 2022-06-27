import {
  HOTEL,
  HOTEL_DATA,
  REQUEST,
  REQUEST_DATA,
  ROOM,
  ROOM_DATA,
} from "../constants/db.constants";

export const hotelRequests = async (
  limit: number,
  skip: number,
  search?: any
) => {
  if (search === "") {
    const resultData = await HOTEL_DATA.findAndCount({
      where: {
        status: false,
      },
      take: limit,
      skip: skip,
    });
    return resultData;
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
  return resultData;
};

export const updateHotelStatus = async (id: number, query) => {
  const resultData = await HOTEL_DATA.update(id, query);
  return resultData;
};

export const getHotels = async (query) => {
  const resultData = await HOTEL_DATA.findBy(query);
  return resultData;
};

export const getAllRooms = async (query) => {
  const resultData = await ROOM_DATA.find(query);
  return resultData;
};

export const addNewRoom = async (room) => {
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

export const addNewHotel = async (hotelData) => {
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

  const request = REQUEST;
  request.status = false;
  request.user = hotel.user;
  await REQUEST_DATA.save(request);
};

export const getRoomById = async (query) => {
  const resultData = await ROOM_DATA.findOneBy(query);
  return resultData;
};
