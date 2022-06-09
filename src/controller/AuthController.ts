import * as express from "express";
import * as bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { Roles } from "../entity/Roles";
import { validationResult } from "express-validator";
import { USER_DATA } from "../constants/db.constants";
import { findUser, signUp } from "../services/authService";

export const userLogin = async (
  req: express.Request,
  res: express.Response,
  next
) => {
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
      let compareResult = await comparePassword(password, userExist.password);
      if (!compareResult) {
        return res.status(401).json("Email ID or Password Mismatch");
      }
      let token = await createToken(
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

export const userSignUp = async (
  req: express.Request,
  res: express.Response,
  next
) => {
  const validationErr = validationResult(req);
  let userExist = await findUser({ email: req.body.user.email });

  if (!validationErr.isEmpty()) {
    return res.status(400).json({ errors: validationErr.array() });
  }
  if (userExist) {
    return res.status(400).json("User Exists Already");
  } else {
    let password = await createPassword(req.body.user.password);
    try {
      const result = await signUp(req.body.user, password);
      return res.status(200).json("Successfully Registered");
    } catch (err) {
      return res.status(500).json("Server Error");
    }
  }
};

const createPassword = async (password: string) => {
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
const comparePassword = async (password: string, hashedPassword: string) => {
  let result = await bcrypt.compare(password, hashedPassword);
  return result;
};

const createToken = async (email: string, role: number, id: number) => {
  const token = await jwt.sign(
    {
      id: id,
      email: email,
      role: role,
    },
    "secretKey",
    { expiresIn: "1h" }
  );
  return token;
};
