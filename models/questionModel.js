import mongoose from "mongoose";
import { Schema } from "mongoose";

const questionModel = new Schema({
  text: String,
  options: [String],
  correctOption: Number,
  difficulty: Number,
  tag: [String],
});

export default mongoose.model("questionModel", questionModel);
