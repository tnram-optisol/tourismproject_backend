import * as express from "express";
import * as bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { Roles } from "../entity/Roles";
import { validationResult } from "express-validator";
import { USER_DATA } from "../constants/db.constants";
import { findUser, signUp } from "../services/authService";
import { createNewNotification } from "../services/notificationService";

export class AuthController {
  userLogin = async (req: express.Request, res: express.Response, next) => {
    let email = req.body.email;
    let password = req.body.password;
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    try {
      let userExist = await findUser({ email: req.body.email });
      if (!userExist) {
        return res.status(400).json("User Not Found");
      }
      if (userExist) {
        let compareResult = await this.comparePassword(
          password,
          userExist.password
        );
        if (!compareResult) {
          return res.status(401).json("Email ID or Password Mismatch");
        }
        let token = await this.createToken(
          userExist.email,
          userExist.role.id,
          userExist.id
        );
        return res.status(200).json({
          name: userExist.name,
          role: userExist.role.id,
          token: token,
        });
      }
    } catch (err) {
      return res.status(500).json("Server Error");
    }
  };

  userSignUp = async (req: express.Request, res: express.Response, next) => {
    const validationErr = validationResult(req);
    let userExist = await findUser({ email: req.body.user.email });

    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    if (userExist) {
      return res.status(400).json("User Exists Already");
    } else {
      let password = await this.createPassword(req.body.user.password);
      try {
        const result = await signUp(req.body.user, password);
        const message = `${
          result.name
        } has joined us on ${new Date().toLocaleDateString()}`;
        const type = "user";
        const notification = await createNewNotification(message, type);
        return res.status(200).json("Successfully Registered");
      } catch (err) {
        return res.status(500).json("Server Error");
      }
    }
  };

  createPassword = async (password: string) => {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
  comparePassword = async (password: string, hashedPassword: string) => {
    let result = await bcrypt.compare(password, hashedPassword);
    return result;
  };

  createToken = async (email: string, role: number, id: number) => {
    const token = await jwt.sign(
      {
        id: id,
        email: email,
        role: role,
      },
      "secretKey",
      { expiresIn: "2h" }
    );
    return token;
  };
}
