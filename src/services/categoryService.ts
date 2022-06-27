import { FindManyOptions } from "typeorm";
import {
  BANNER_DATA,
  CATEGORY,
  CATEGORY_DATA,
  TOURCATEGORY,
  TOUR_CATEGORY_DATA,
  TOUR_REVIEW_DATA,
} from "../constants/db.constants";
import { Category } from "../entity/Category";
import { Tours } from "../entity/Tours";
import { getRating } from "./reviewService";

export const getAllCategory = async (query?: any) => {
  if (query) {
    const resultData = await CATEGORY_DATA.findAndCount(query);
    return resultData;
  }
  const resultData = await CATEGORY_DATA.find();
  return resultData;
};

export const removeCategory = async (query) => {
  const resultData = await CATEGORY_DATA.delete(query);
  return resultData;
};

export const addCategory = async (name: string, image: string) => {
  const newCategory = CATEGORY;
  newCategory.image = image;
  newCategory.category = name;
  const resultData = await CATEGORY_DATA.save(newCategory);
  return resultData;
};

export const updateCategory = async (
  tour: Tours,
  category: number,
  closed_on: Date
) => {
  const newCategory = TOURCATEGORY;
  newCategory.tour = tour;
  newCategory.category = category;
  newCategory.closed_on = closed_on;
  const categoryExist = await TOUR_CATEGORY_DATA.findOneBy({
    tour: {
      tour_id: tour.tour_id,
    },
  });
  if (categoryExist) {
    const resultData = await TOUR_CATEGORY_DATA.save(categoryExist);
    return resultData;
  }
  const resultData = await TOUR_CATEGORY_DATA.save(newCategory);
  return resultData;
};

export const getCategoryLocation = async (query) => {
  const resultData = await CATEGORY_DATA.findOneBy(query);
  return resultData;
};

export const getTourCategoryData = async (categoryId) => {
  const resultData = await TOUR_CATEGORY_DATA.createQueryBuilder("category")
    .innerJoinAndSelect("category.tour", "tours")
    .where(":category= ANY(category.category)", { category: +categoryId })
    .getMany();
  return resultData;
};

export const getAdminCategoryData = async (
  take: number,
  skip: number,
  search?: any
) => {
  if (search !== "") {
    const resultData = await CATEGORY_DATA.createQueryBuilder("category")
      .where("category.category ILIKE :q", {
        q: `%${search}%`,
      })
      .getMany();
    return resultData;
  }
  const resultData = await CATEGORY_DATA.findAndCount({
    take: take,
    skip: skip,
    order: {
      id: "ASC",
    },
  });
  return resultData;
};
