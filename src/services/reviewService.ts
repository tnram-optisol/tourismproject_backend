import * as express from "express";
import {
  TOUR_DATA,
  TOUR_REVIEW,
  TOUR_REVIEW_DATA,
} from "../constants/db.constants";
export const postReview = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const tourExist = await TOUR_DATA.findOneBy({ tour_id: req.body.tour });

  const tourReview = TOUR_REVIEW;
  tourReview.posted_By = req.body.name;
  tourReview.rating = req.body.rating;
  tourReview.review = req.body.comment;
  tourReview.tour = tourExist;
  await TOUR_REVIEW_DATA.manager.save(tourReview);

  return res.status(200).json("Review Posted Successfully");
};

export const getRating = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const id = +req.params.id;
  const tourExist = await TOUR_DATA.findOneBy({ tour_id: id });
  const viewReview = await TOUR_REVIEW_DATA.createQueryBuilder("review")
    .select(" CAST(AVG(review.rating) AS DECIMAL(16,1))", "rating")
    .where("review.tour_id=:id", { id })
    .getRawOne();
  if (viewReview) {
    return res.status(200).json(viewReview);
  }
  return res.status(200).json("No reviews Available");
};

export const viewReview = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const tourExist = await TOUR_DATA.findOneBy({ tour_id: +req.params.id });
  const viewReview = await TOUR_REVIEW_DATA.findBy({ tour: tourExist });
  if (viewReview) {
    return res.status(200).json(viewReview);
  }
  return res.status(200).json("No reviews Available");
};
