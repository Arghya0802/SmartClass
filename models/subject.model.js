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
      unique: true,
      validate: function () {
        if (this.uniqueId.length < 3 || this.uniqueId[1] !== "-") return false;
        return true;
      },
    },
    department: {
      type: String,
    },
    teachers: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", departmentSchema);

export default Subject;
