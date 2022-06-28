import {
  REQUEST,
  REQUEST_DATA,
  TOUR,
  TOUR_DATA,
} from "../constants/db.constants";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";

export const tourRequests = async (
  limit: number,
  skip: number,
  search?: any
) => {
  if (search === "") {
    const resultData = await TOUR_DATA.findAndCount({
      where: {
        status: false,
      },
      take: limit,
      skip: skip,
    });
    return resultData;
  }
  const resultData = await TOUR_DATA.createQueryBuilder("tour")
    .innerJoinAndSelect("tour.user", "user")
    .innerJoinAndSelect("user.role", "role")
    .where("tour.package_name ILIKE :q or user.name ILIKE :q", {
      q: `%${search}%`,
    })
    .where("tour.status =:status", { status: false })
    .getMany();
  return resultData;
};

export const updateTourData = async (id: number, query) => {
  const resultData = await TOUR_DATA.update(id, query);
  return resultData;
};

export const getTours = async (query) => {
  const resultData = await TOUR_DATA.find(query);
  return resultData;
};

export const addNewTour = async (tourData) => {
  let tour = TOUR;
  tour.package_name = tourData.package_name;
  tour.from = tourData.from;
  tour.to = tourData.to;
  tour.tour_image = tourData.tour_image;
  tour.provider_license = tourData.provider_license;
  tour.description = tourData.description;
  tour.availablity = true;
  tour.status = false;
  tour.startDate = tourData.startDate;
  tour.endDate = tourData.endDate;
  tour.total_days = tourData.total_days;
  tour.max_person = 100;
  tour.cost = tourData.cost;
  tour.user = tourData.user;
  await TOUR_DATA.save(tour);

  const message = `${tour.user.name} has raised request to add ${tour.package_name}`;
  const type = "request_tour";
  const newNotification = new Notification();
  newNotification.notification = message;
  newNotification.type = type;
  await AppDataSource.manager.save(newNotification);

  let request = REQUEST;
  request.status = false;
  request.user = tour.user;
  await REQUEST_DATA.save(request);
};

export const getTourById = async (query) => {
  const resultData = await TOUR_DATA.findOneBy(query);
  return resultData;
};
