import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const tokenVerification = (req, res, next) => {
  const token  = req.cookies.access_token;
  if(!token){
    return next(errorHandler(401, "Access denied!"));
  }

  jwt.verify(token, process.env.SECRET_PASS, (error, user) => {
    if(error){
      return next(errorHandler(401, "Access denied!"));
    }

    req.user = user;
    console.log(req.user);
    next();
  });
}