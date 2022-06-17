import * as express from "express";
import * as bcrypt from "bcrypt";
import { body } from "express-validator";
import { AuthController } from "../controller/AuthController";

const router = express.Router();
const authController = new AuthController();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }),
  ],
  authController.userLogin
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
  authController.userSignUp
);

export default router;
