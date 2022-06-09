import * as express from "express";
import * as bcrypt from "bcrypt";
import { body } from "express-validator";
import { userLogin, userSignUp } from "../controller/AuthController";

const router = express.Router();

router.post(
  "/signin",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  userLogin
);

router.post(
  "/signup",
  [
    body("user.email").isEmail().withMessage("Invalid Email"),
    body("user.password").isLength({ min: 6 }).withMessage("Invalid Password"),
    body("user.name").isAlpha().withMessage("Invalid Name"),
    body("user.place").isAlpha().withMessage("Invalid Place"),
    body("user.contact").isNumeric().withMessage("Invalid Contact"),
    body("user.roleId").isNumeric().withMessage("Invalid RoleId"),
  ],
  userSignUp
);

export default router;
