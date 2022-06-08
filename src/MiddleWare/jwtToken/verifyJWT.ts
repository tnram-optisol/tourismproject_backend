import * as express from "express";
import * as jwt from "jsonwebtoken";

export const verifyJWT = (req, res: express.Response, next) => {
  let token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, "secretKey", (err, result) => {
      if (err) {
        return res.status(403).json("Unauthorized User");
      } else {
        req.user = result;
        return next();
      }
    });
  } else {
    return res.status(401).json("Token Not Found");
  }
};
