import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { DB_URL } from "./configs/server.js";
import { AppError } from "./utils/customResponse.js";

// Routes Imports
import auth from "./routes/auth.js";
import quiz from "./routes/quiz.js";

import { globalErrorHandler } from "./errorController/errorControllers.js";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
export const db = mongoose.connection;

mongoose.connection.on(
  "error",
  console.error.bind(console, "Mongoose Connection Error, ")
);
mongoose.connection.once("open", () => {
  console.info("Connection to the Database Established");
});

app.use(express.json({ limit: "10mb" }));
app.use(cors());

//ROUTES
app.use("/api/auth", auth);
app.use("/api/quiz", quiz);

// capturing non existing routes error
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
