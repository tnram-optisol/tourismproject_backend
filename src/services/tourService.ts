import {
  REQUEST,
  REQUEST_DATA,
  TOUR,
  TOUR_DATA,
} from "../constants/db.constants";

export const tourRequests = async (query) => {
  const resultData = await TOUR_DATA.findBy(query);
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

  let request = REQUEST;
  request.status = false;
  request.user = tour.user;
  await REQUEST_DATA.save(request);
};

export const getTourById = async (query) => {
  const resultData = await TOUR_DATA.findOneBy(query);
  return resultData;
};