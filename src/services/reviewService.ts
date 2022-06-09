import { TOUR_REVIEW, TOUR_REVIEW_DATA } from "../constants/db.constants";
import { Tours } from "../entity/Tours";

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
};
