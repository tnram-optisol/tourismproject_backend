import { USER_DATA } from "../constants/db.constants";
import { Users } from "../entity/User";

export class AuthService {
  findUser = async (query) => {
    const result = await USER_DATA.findOneBy(query);
    return result;
  };

  signUp = async (userData, password) => {
    if (userData.external) {
      const user = new Users();
      user.name = userData.name;
      user.email = userData.email;
      user.password = password;
      user.contact = userData.contact;
      user.place = userData.place;
      user.role = userData.roleId;
      user.external = userData.external;
      const response = await USER_DATA.save(user);
      return response;
    }
    const user = new Users();
    user.name = userData.name;
    user.email = userData.email;
    user.password = password;
    user.contact = userData.contact;
    user.place = userData.place;
    user.role = userData.roleId;
    user.external = false;
    const response = await USER_DATA.save(user);
    return response;
  };

  updateUser = async (userData: Users, password?: string) => {
    const user_id: number = userData.id;
    if (password !== "") {
      const response = await USER_DATA.update(user_id, {
        password: password,
        external: false,
      });
      return response;
    }
    return null;
  };

  updateProfile = async (id: number, userData, password: string) => {
    const user = await USER_DATA.findOneBy({
      id: id,
    });
    if (user) {
      user.password = password;
      user.contact = userData.contact;
      user.place = userData.place;
      user.role = userData.roleId;
      user.external = true;
      const response = await USER_DATA.save(user);
      return response;
    }
    return null;
  };
}
