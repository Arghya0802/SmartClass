import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    fullMarks: {
      type: Number,
    },
    marksObtained: {
      type: Number,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    submissions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
