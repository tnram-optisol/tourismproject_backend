import { USER_DATA } from "../constants/db.constants";
import { Users } from "../entity/User";

export const findUser = async (query) => {
  const result = await USER_DATA.findOneBy(query);
  return result;
};

export const signUp = async (userData, password) => {
  const user = new Users();
  user.name = userData.name;
  user.email = userData.email;
  user.password = password;
  user.contact = userData.contact;
  user.place = userData.place;
  user.role = userData.roleId;

  const response = await USER_DATA.save(user);
  return response;
};

export const updateUser = async (
  userData: Users,
  password?: string,
  otp?: number
) => {
  const user_id: number = userData.id;
  if (password !== "") {
    const response = await USER_DATA.update(user_id, {
      password: password,
      otp: 0,
    });
    return response;
  }
  if (otp > 0) {
    const response = await USER_DATA.update(user_id, {
      otp: otp,
    });
    return response;
  }
  return null;
};
