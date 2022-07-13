import { FindManyOptions } from "typeorm";
import {
  BANNER_DATA,
  CATEGORY,
  CATEGORY_DATA,
  TOURCATEGORY,
  TOUR_CATEGORY_DATA,
  TOUR_DATA,
  TOUR_REVIEW_DATA,
} from "../constants/db.constants";
import { Category } from "../entity/Category";
import { Tours } from "../entity/Tours";
import { BannerService } from "./bannerService";

const bannerService = new BannerService();

export class CategoryService {
  getAllCategory = async (query?: any) => {
    if (query) {
      const resultData = await CATEGORY_DATA.findAndCount(query);
      console.log(resultData);
      return resultData;
    }
    const resultData = await CATEGORY_DATA.find();
    return resultData;
  };

  removeCategory = async (query) => {
    const resultData = await CATEGORY_DATA.delete(query);
    return resultData;
  };

  addCategory = async (name: string, image: string) => {
    const newCategory = CATEGORY;
    newCategory.image = image;
    newCategory.category = name;
    const resultData = await CATEGORY_DATA.save(newCategory);
    return resultData;
  };

  updateCategory = async (tour: number, category: number, closed_on: Date) => {
    const tourData = await TOUR_DATA.findOneBy({
      tour_id: tour,
    });
    const categoryExist = await TOUR_CATEGORY_DATA.findOneBy({
      tour: {
        tour_id: tour,
      },
    });
    if (categoryExist) {
      categoryExist.tour = tourData;
      categoryExist.category = category;
      categoryExist.closed_on = closed_on;
      const resultData = await TOUR_CATEGORY_DATA.save(categoryExist);
      return resultData;
    }
    const newCategory = TOURCATEGORY;
    newCategory.tour = tourData;
    newCategory.category = category;
    newCategory.closed_on = closed_on;
    const resultData = await TOUR_CATEGORY_DATA.save(newCategory);
    return resultData;
  };

  getCategoryLocation = async (query) => {
    const resultData = await CATEGORY_DATA.findOneBy(query);
    return resultData;
  };

  getTourCategoryData = async (categoryId) => {
    const resultData = await TOUR_CATEGORY_DATA.createQueryBuilder("category")
      .innerJoinAndSelect("category.tour", "tours")
      .where(":category= ANY(category.category)", { category: +categoryId })
      .getMany();
    return resultData;
  };

  getAdminCategoryData = async (take: number, skip: number, search?: any) => {
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
}
