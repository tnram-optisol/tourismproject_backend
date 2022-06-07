import * as express from "express";
import * as bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/User";
import e = require("express");
import * as jwt from "jsonwebtoken";
import { Roles } from "../entity/Roles";
import { body, validationResult } from "express-validator";

const router = express.Router();

const userData = AppDataSource.getRepository(Users);

router.post(
  "/signin",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req: express.Request, res: express.Response, next) => {
    let email = req.body.email;
    let password = req.body.password;
    const validationErr = validationResult(req);
    let userExist = await userData.findOneBy({ email: req.body.email });

    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
      next();
    }

    if (!userExist) {
      return res.status(400).json("User Not Found");
      next();
    }
    if (userExist) {
      let compareResult = await comparePassword(password, userExist.password);
      if (!compareResult) {
        return res.status(401).json("Email ID or Password Mismatch");
        next();
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
  }
);

router.post(
  "/signup",
  [
    body("user.email").isEmail().withMessage('Invalid Email'),
    body("user.password").isLength({ min: 6 }).withMessage('Invalid Password'),
    body("user.name").isAlpha().withMessage('Invalid Name'),
    body("user.place").isAlpha().withMessage('Invalid Place'),
    body('user.contact').isNumeric().withMessage('Invalid Contact'),
    body('user.roleId').isNumeric().withMessage('Invalid RoleId')
  ],
  async (req: express.Request, res: express.Response, next) => {
    const validationErr = validationResult(req);
    let userExist = await userData.findOneBy({ email: req.body.user.email });

    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
      next();
    }
    if (userExist) {
      return res.status(400).json("User Exists Already");
      next();
    } else {
      let password = await createPassword(req.body.user.password);
      const user = new Users();
      user.name = req.body.user.name;
      user.email = req.body.user.email;
      user.password = password;
      user.contact = req.body.user.contact;
      user.place = req.body.user.place;
      user.role = req.body.user.roleId;

      await AppDataSource.manager.save(user);
      return res.status(200).json("Successfully Registered");
    }
  }
);

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

export default router;
