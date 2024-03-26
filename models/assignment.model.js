import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fullMarks: {
      type: String,
      required: true,
    },
    subjectId: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    links: [
      {
        type: String,
        // required: true,
      },
    ],
    solutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
      },
    ],
  },
  { timestamps: true }
);

// assignmentSchema.methods.yetToBeSubmitted = async () => {
//   const teacherDepartment =
//   const department = await Department.findOne({tea})
// }

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
