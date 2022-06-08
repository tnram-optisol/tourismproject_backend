import * as express from "express";
import * as mailService from "./mailService";
import {
  ADMIN_MAIL,
  ADMIN_MAIL_DATA,
  BANNER_DATA,
  CATEGORY_DATA,
  HOTEL_DATA,
  ROOM_DATA,
  TOUR_CATEGORY_DATA,
  TOUR_DATA,
} from "../constants/db.constants";

export const getAllTours = async (req, res: express.Response, next) => {
  let tourExist = await TOUR_DATA.findBy({ status: true });
  if (tourExist) {
    return res.status(200).json(tourExist);
  }
  return res.status(400).json("No Tour Available");
};

export const getHomeTour = async (req, res: express.Response, next) => {
  let bannerExist = await BANNER_DATA.find({
    order: {
      sequence: "ASC",
    },
  });
  if (bannerExist) {
    return res.status(200).json(bannerExist);
  }
  return res.status(400).json("No Tour Available");
};

export const viewTour = async (req, res: express.Response, next) => {
  let tour_id = +req.params.id;
  let tourExist = await TOUR_DATA.findBy({ tour_id: tour_id });
  if (tourExist) {
    return res.status(200).json(tourExist);
  }
  return res.status(400).json("No Tour Available");
};

export const viewHotel = async (req, res: express.Response, next) => {
  let hotelExist = await HOTEL_DATA.find({
    where: {
      status: true,
    },
  });
  if (hotelExist) {
    return res.status(200).json(hotelExist);
  }
  return res.status(400).json("No Hotel Available");
};

export const viewRooms = async (req, res: express.Response, next) => {
  let roomId = +req.params.id;
  let roomExist = await ROOM_DATA.find({
    where: {
      room_id: roomId,
    },
  });
  if (roomExist) {
    return res.status(200).json(roomExist);
  }
  return res.status(400).json("No Rooms Available");
};

export const getRooms = async (req, res: express.Response, next) => {
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

export const paginateTour = async (req, res: express.Response, next) => {
  const ITEMS_PER_PAGE = 2;
  const take = ITEMS_PER_PAGE;
  //const skip= (take-1) > 1 ? (take-1):0
  const skip = (parseInt(req.params.take) - 1) * ITEMS_PER_PAGE;
  console.log(take, skip);
  let totalTour = await BANNER_DATA.find({
    where: {
      tour: {
        status: true,
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

export const sendMail = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  let userMail = ADMIN_MAIL;
  userMail.user_mail = req.body.user.email;
  userMail.user_name = req.body.user.name;
  userMail.user_message = req.body.user.message;
  await ADMIN_MAIL_DATA.save(userMail);
  const message = {
    from: req.body.user.email,
    to: "admin@abc.com",
    subject: "Query Mail ",
    html: `<h1>${req.body.user.message}</h1>`,
  };
  mailService.transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(400).json("Try Again");
    }
    return res.status(200).json("Mail Sent Successfully to admin");
  });
};

export const filterByCategory = async (req, res: express.Response, next) => {
  let categoryId = req.params.category;
  if (categoryId > 0) {
    let tourExist = await TOUR_CATEGORY_DATA.createQueryBuilder("category")
      .innerJoinAndSelect("category.tour", "tours")
      .where(":category= ANY(category.category)", { category: +categoryId })
      .getMany();
    if (tourExist) {
      return res.status(200).json(tourExist);
    }
  } else {
    let tourExist = await BANNER_DATA.createQueryBuilder("banner")
      .innerJoinAndSelect("banner.tour", "tours")
      .getMany();
    if (tourExist) {
      return res.status(200).json(tourExist);
    }
  }

  return res.status(400).json("No Tour Available");
};

export const getCategory = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const result = await CATEGORY_DATA.find();
  return res.status(200).json(result);
};

export const searchTourData = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const location = req.params.location;
  const result = await CATEGORY_DATA.findOneBy({
    category: location,
  });
  let categoryId = result.id;
  if (categoryId > 0) {
    let tourExist = await TOUR_CATEGORY_DATA.createQueryBuilder("category")
      .innerJoinAndSelect("category.tour", "tours")
      .where(":category= ANY(category.category)", { category: +categoryId })
      .getMany();
    if (tourExist) {
      return res.status(200).json(tourExist);
    }
  } else {
    let tourExist = await BANNER_DATA.createQueryBuilder("banner")
      .innerJoinAndSelect("banner.tour", "tours")
      .getMany();
    if (tourExist) {
      return res.status(200).json(tourExist);
    }
  }
};
