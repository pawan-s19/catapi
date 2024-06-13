import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/server.js";
import userModel from "../models/userModel.js";
import { AppError } from "./customResponse.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    console.log(bearerToken);

    const token = bearerToken?.split("Bearer ")[1];
    console.log(token);

    if (!token) {
      return next(new AppError("No token provided", 401));
    }

    const { id } = jwt.verify(token, JWT_SECRET);
    console.log(id);

    if (!id) return next(new AppError("Invalid Token", 401));

    const user = await userModel.findOne({ _id: id });

    if (!user) return next(new AppError("User not found", 404));

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Handle token expiration error
      return next(new AppError("Token Expired, Login again", 401));
    } else {
      // Handle other verification errors
      return next(new AppError("Verification failed, Login again", 401));
    }
  }
};
