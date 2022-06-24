import { BANNER, BANNER_DATA } from "../constants/db.constants";
import { Banner } from "../entity/Banner";
import { Tours } from "../entity/Tours";

export const getAllBanner = async (query) => {
  const resultData = await BANNER_DATA.find(query);
  return resultData;
};

export const getBannerById = async (query) => {
  const resultData = await BANNER_DATA.findOneBy(query);
  return resultData;
};

export const updateBanner = async (banner: Banner) => {
  const resultData = await BANNER_DATA.save(banner);
  return resultData;
};

export const getSequence = async (query, as) => {
  const resultData = await BANNER_DATA.createQueryBuilder("banner")
    .select(query, as)
    .getRawOne();
  return resultData;
};

export const getTourBanner = async (query, as) => {
  const resultData = await BANNER_DATA.createQueryBuilder("banner")
    .innerJoinAndSelect(query, as)
    .getMany();
  return resultData;
};

export const saveBanner = async (tour: Tours, sequence: number) => {
  const newBanner = BANNER;
  (newBanner.tour = tour), (newBanner.sequence = sequence);
  const resultData = await BANNER_DATA.save(newBanner);
  return resultData;
};

export const getBannerByTourId = async (id: number) => {
  const resultData = await BANNER_DATA.findOneBy({
    tour: {
      tour_id: id,
    },
  });
  return resultData;
};

export const getAdminBannerData = async (
  take: number,
  skip: number,
  search?: any
) => {
  if (search !== "") {
    const resultData = await BANNER_DATA.createQueryBuilder("banner")
      .innerJoinAndSelect("banner.tour", "tour")
      .where("tour.package_name ILIKE :q", {
        q: `%${search}%`,
      })
      .getMany();
    return resultData;
  }
  const resultData = await BANNER_DATA.findAndCount({
    take: take,
    skip: skip,
    order: {
      sequence: "ASC",
    },
  });
  return resultData;
};
