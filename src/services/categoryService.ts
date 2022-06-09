import {
  CATEGORY,
  CATEGORY_DATA,
  TOURCATEGORY,
  TOUR_CATEGORY_DATA,
} from "../constants/db.constants";
import { Category } from "../entity/Category";
import { Tours } from "../entity/Tours";

export const getAllCategory = async () => {
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
