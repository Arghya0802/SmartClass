import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dueDate: {
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
    link: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

// assignmentSchema.methods.yetToBeSubmitted = async () => {
//   const teacherDepartment =
//   const department = await Department.findOne({tea})
// }

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
