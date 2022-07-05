import { USER_DATA } from "../constants/db.constants";
import { Users } from "../entity/User";

export class AuthService {
  findUser = async (query) => {
    const result = await USER_DATA.findOneBy(query);
    return result;
  };

  signUp = async (userData, password) => {
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

  updateUser = async (userData: Users, password?: string) => {
    const user_id: number = userData.id;
    if (password !== "") {
      const response = await USER_DATA.update(user_id, {
        password: password,
      });
      return response;
    }
    return null;
  };
}
