import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRE, JWT_SECRET } from "../configs/server.js";

const userModel = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    select: false,
  },
  googleId: {
    type: String,
  },
  name: String,
  picture: String,
});

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  else this.password = await bcrypt.hash(this.password, 10);
});

userModel.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userModel.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

userModel.index({
  email: "text",
});

export default mongoose.model("userModel", userModel);
