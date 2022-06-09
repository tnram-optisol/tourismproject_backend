import {
  ADMIN_MAIL,
  ADMIN_MAIL_DATA,
  REQUEST_DATA,
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
