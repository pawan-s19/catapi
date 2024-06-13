import { asyncErrorHandler } from "../errorController/errorControllers.js";
import userModel from "../models/userModel.js";
import { status } from "../utils/constants.js";
import { AppError, Success } from "../utils/customResponse.js";
import { sendToken } from "../utils/sendToken.js";

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email)
    return next(new AppError("Please enter email", status.BAD_REQUEST));
  if (!password)
    return next(
      new AppError("Please enter password to continue", status.BAD_REQUEST)
    );

  const user = await userModel
    .findOne({
      email: email,
    })
    .select("+password");

  if (!user)
    return next(
      new AppError("Please enter valid email or password", status.BAD_REQUEST)
    );

  const matchPassword = await user.comparePassword(password);

  if (!matchPassword)
    return next(new AppError("Invalid Credentials", status.BAD_REQUEST));

  sendToken(res, 200, user);
});

export const register = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const creationData = {};

  if (!email)
    return next(new AppError("Please enter email", status.BAD_REQUEST));
  if (!password)
    return next(new AppError("Please enter password", status.BAD_REQUEST));

  creationData.email = email;
  creationData.password = password;

  const newUser = await userModel.create(creationData);

  sendToken(res, 201, newUser);
});

export const getLoggedInProfile = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;

  return res
    .status(status.SUCCESS)
    .json(new Success("view", user, res.statusCode));
});

export const googleLogin = asyncErrorHandler(async (req, res, next) => {
  const { email, picture, name, id } = req.body;

  if (!email)
    return next(new AppError("Please enter email", status.BAD_REQUEST));
  if (!id)
    return next(new AppError("GoogleId not received", status.BAD_REQUEST));

  let user = await userModel.findOne({
    googleId: id,
  });

  if (!user) {
    user = await userModel.create({
      email,
      name,
      picture,
      googleId: id,
    });
  }

  sendToken(res, 200, user);
});
