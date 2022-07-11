import { COUPON, COUPON_DATA } from "../constants/db.constants";

export const getCouponsData = async (
  take: number,
  skip: number,
  search?: any | string
) => {
  if (search === "" && (take !== 1 || 0 || skip !== 0)) {
    const resultData = await COUPON_DATA.findAndCount({
      take: take,
      skip: skip,
    });
    return resultData;
  }
  if (take === 1) {
    const resultData = await COUPON_DATA.createQueryBuilder("coupon")
      .orderBy("random()")
      .take(take)
      .skip(skip)
      .getMany();
    return resultData;
  }
  const resultData = await COUPON_DATA.findAndCount();
  return resultData;
};

export const addCouponsData = async (coupon: {
  coupon_name: string;
  percent_off: any;
}) => {
  const new_coupon = COUPON;
  new_coupon.coupon_name = coupon.coupon_name;
  new_coupon.percent_off = coupon.percent_off;
  new_coupon.addedOn = new Date();
  const response = await COUPON_DATA.save(new_coupon);
  return response;
};
