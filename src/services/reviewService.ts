import {
  BANNER_DATA,
  TOUR_CATEGORY_DATA,
  TOUR_REVIEW,
  TOUR_REVIEW_DATA,
} from "../constants/db.constants";
import { Tours } from "../entity/Tours";
import { getBannerByTourId } from "./bannerService";

export const getRating = async (id) => {
  const result = await TOUR_REVIEW_DATA.createQueryBuilder("review")
    .select(" CAST(AVG(review.rating) AS DECIMAL(16,1))", "rating")
    .where("review.tour_id=:id", { id })
    .getRawOne();
  return result;
};

export const getReviewById = async (tourExist) => {
  const result = await TOUR_REVIEW_DATA.findBy({ tour: tourExist });
  return result;
};

export const saveReview = async (
  name: string,
  rating: number,
  comment: string,
  tourExist: Tours
) => {
  const tourReview = TOUR_REVIEW;
  tourReview.posted_By = name;
  tourReview.rating = rating;
  tourReview.review = comment;
  tourReview.tour = tourExist;
  await TOUR_REVIEW_DATA.save(tourReview);

  const bannerExist = await getBannerByTourId(tourExist.tour_id);
  let myRating = await getRating(bannerExist.tour.tour_id);
  bannerExist.rating = myRating.rating
  await BANNER_DATA.save(bannerExist);

  const categoryExist = await TOUR_CATEGORY_DATA.findOneBy({
    tour: {
      tour_id: tourExist.tour_id,
    },
  });
  categoryExist.rating = myRating.rating;
  await TOUR_CATEGORY_DATA.save(categoryExist);

  return tourReview
};
