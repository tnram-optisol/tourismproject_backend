import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { validationResult } from "express-validator";

import { AuthService } from "../services/authService";
import { NotificationService } from "../services/notificationService";
import * as mailService from "../services/mailService";
import { OtpService } from "../services/otpService";

const otpService = new OtpService();
const authService = new AuthService();
const notificationService = new NotificationService();

export class AuthController {
  userLogin = async (req: express.Request, res: express.Response, next) => {
    let email = req.body.email;
    let password = req.body.password;
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    try {
      let userExist = await authService.findUser({ email: req.body.email });
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
          userExist.id,
          userExist.external
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
    let userExist = await authService.findUser({ email: req.body.user.email });
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    if (userExist) {
      if (req.body.user.external) {
        let token = await this.createToken(
          userExist.email,
          userExist.role.id,
          userExist.id,
          userExist.external
        );
        return res.status(200).json({
          name: userExist.name,
          role: userExist.role.id,
          token: token,
          external: userExist.external,
        });
      }
      return res.status(400).json("User Exists Already");
    } else {
      let password = await this.createPassword(req.body.user.password);
      try {
        const result = await authService.signUp(req.body.user, password);
        const message = `${
          result.name
        } has joined us on ${new Date().toLocaleDateString()}`;
        const type = "user";
        const notification = await notificationService.createNewNotification(
          message,
          type
        );
        if (req.body.user.external) {
          let token = await this.createToken(
            result.email,
            result.role.id,
            result.id,
            userExist.external
          );
          return res.status(200).json({
            name: result.name,
            role: result.role.id,
            token: token,
          });
        }
        return res.status(200).json("Successfully Registered");
      } catch (err) {
        console.log(err);
        return res.status(500).json("Server Error");
      }
    }
  };

  generateOtp = async (req: express.Request, res: express.Response, next) => {
    const validationErr = validationResult(req);
    let userExist = await authService.findUser({ email: req.body.email });

    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    if (!userExist) {
      return res.status(400).json("Email Id doesn't Exists");
    }
    const otp = crypto.randomInt(100000, 999999);
    const date = new Date();
    const expiresIn = date.getTime() + 5 * 60 * 1000;
    const response = await otpService.createNewOTP(
      userExist.email,
      otp,
      expiresIn
    );
    const message = {
      from: "admin@abc.com",
      to: userExist.email,
      subject: "Password Reset ",
      html: `<h1>Password Reset Mail.</h1><br>
            <p>Please enter the otp ${otp} to reset password</p><br>
            <p>Will expire in five minutes from now.</p><br>
            <p>Don't disclose or share this otp with any one</p>`,
    };
    mailService.transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Try Again");
      }
      return res
        .status(200)
        .json(`Mail Sent Successfully at ${userExist.email}`);
    });
  };

  resetPassword = async (req: express.Request, res: express.Response, next) => {
    const validationErr = validationResult(req);
    if (!validationErr.isEmpty()) {
      return res.status(400).json({ errors: validationErr.array() });
    }
    let otpExist = await otpService.findOtp(req.body.otp);
    if (!otpExist) {
      return res.status(400).json("Invalid OTP or OTP Expired");
    }
    const newPassword = await this.createPassword(req.body.password);
    let userExist = await authService.findUser({ email: otpExist.email });
    const response = await authService.updateUser(userExist, newPassword);
    const deleteOtp = await otpService.clearOtpData(userExist.email);
    return res.status(200).json("Password Updated!! Login to Check!!");
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

  createToken = async (
    email: string,
    role: number,
    id: number,
    external: boolean
  ) => {
    const token = await jwt.sign(
      {
        id: id,
        email: email,
        role: role,
        external: external,
      },
      "secretKey",
      { expiresIn: "2h" }
    );
    return token;
  };
}
