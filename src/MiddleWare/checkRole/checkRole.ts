import * as express from "express";
import { ROLES } from "../role.constant";

export const checkRole = (req, res: express.Response, next) => {
  const role = +req.headers.role;
  if (ROLES.findIndex((el) => el === role) !== -1) {
    return next();
  } else {
    return res.status(401).send("Access Denied ");
  }
};
