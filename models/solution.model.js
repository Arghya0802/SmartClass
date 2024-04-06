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
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
