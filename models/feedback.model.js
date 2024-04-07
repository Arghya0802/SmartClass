import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    departmentId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 100,
      //   required: true,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
