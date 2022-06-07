import * as express from "express";
import { AppDataSource } from "../data-source";
import { TourReview } from "../entity/TourReview";
import { Tours } from "../entity/Tours";

const reviewData = AppDataSource.getRepository(TourReview);
const tourData = AppDataSource.getRepository(Tours);

export const postReview = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const tourExist = await tourData.findOneBy({ tour_id: req.body.tour });

  const tourReview = new TourReview();
  tourReview.posted_By = req.body.name;
  tourReview.rating = req.body.rating;
  tourReview.review = req.body.comment;
  tourReview.tour = tourExist;
  await AppDataSource.manager.save(tourReview);

  return res.status(200).json("Review Posted Successfully");
};

export const getRating = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const id = +req.params.id;
  const tourExist = await tourData.findOneBy({ tour_id: id });
  const viewReview = await reviewData
    .createQueryBuilder("review")
    .select(" CAST(AVG(review.rating) AS DECIMAL(16,1))", "rating")
    .where("review.tour_id=:id", { id })
    .getRawOne();
  if (viewReview) {
    return res.status(200).json(viewReview);
  }
  return res.status(200).json("No reviews Available");
};

export const viewReview =  async (req: express.Request, res: express.Response, next) => {
    const tourExist = await tourData.findOneBy({ tour_id: +req.params.id });
    const viewReview = await reviewData.findBy({ tour: tourExist });
    if (viewReview) {
      return res.status(200).json(viewReview);
    }
    return res.status(200).json("No reviews Available");
  }