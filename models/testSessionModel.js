import mongoose from "mongoose";
import { Schema } from "mongoose";

const testSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "userModel" },
    questionsShowed: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "questionModel",
        },
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("testSessionModel", testSessionSchema);
