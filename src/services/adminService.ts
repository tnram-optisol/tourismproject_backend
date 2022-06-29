import {
  ADMIN_MAIL,
  ADMIN_MAIL_DATA,
  REQUEST_DATA,
  USER_DATA,
} from "../constants/db.constants";

export const getAllRequests = async (query) => {
  const resultData = await REQUEST_DATA.findBy(query);
  return resultData;
};

export const saveMail = async (email, name, message) => {
  let userMail = ADMIN_MAIL;
  userMail.user_mail = email;
  userMail.user_name = name;
  userMail.user_message = message;
  await ADMIN_MAIL_DATA.save(userMail);
};

export const findAllUser = async (
  search: string | any,
  take: number,
  skip: number
) => {
  if (search !== "") {
    const response = USER_DATA.createQueryBuilder("user")
      .where(
        "user.name ILIKE :q or user.email LIKE :q or user.place ILIKE :q or user.contact LIKE :q",
        {
          q: `%${search}%`,
        }
      )
      .getMany();
    return response;
  }
  if (take !== 0 || skip !== 0) {
    const response = USER_DATA.findAndCount({
      take: take,
      skip: skip,
    });
    return response;
  }
  const response = USER_DATA.findAndCount();
  return response;
};
