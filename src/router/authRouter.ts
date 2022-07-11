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
    body("user.name")
      .exists()
      .trim()
      .matches('/[a-zA-Z. ]/')
      .withMessage("Invalid Name"),
    body("user.place").isAlpha().withMessage("Invalid Place"),
    body("user.contact").isNumeric().withMessage("Invalid Contact"),
    body("user.roleId").isNumeric().withMessage("Invalid RoleId"),
  ],
  authController.userSignUp
);

router.post(
  "/get-otp",
  [body("email").isEmail().withMessage("Invalid Email")],
  authController.generateOtp
);

router.post(
  "/reset-pass",
  [
    body("otp").isNumeric().withMessage("Otp must be a number"),
    body("password")
      .exists()
      .isLength({ min: 6 })
      .withMessage("Reset Password required"),
    body("cnf_password")
      .exists()
      .custom((value, { req }) => {
        if (
          value !== req.body.password &&
          value.length !== req.body.password.length
        ) {
          throw new Error("Both Password Field must same");
        }
        return true;
      }),
  ],
  authController.resetPassword
);

export default router;

//for testing
export { authController };
