import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    uniqueId: {
      type: String,
      required: true,
      // unique: true,
      validate: function () {
        if (
          this.uniqueId.length < 3 ||
          this.uniqueId[1] !== "-" ||
          this.uniqueId[0] !== "L"
        )
          return false;
        return true;
      },
    },
    departmentId: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
