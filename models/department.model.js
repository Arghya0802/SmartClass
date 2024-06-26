import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
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
        if (
          this.uniqueId.length < 3 ||
          this.uniqueId[1] !== "-" ||
          this.uniqueId[0] !== "D"
        )
          return false;
        return true;
      },
    },
    subjects: [
      {
        type: String,
      },
    ],
    teachers: [
      {
        type: String,
      },
    ],
    students: [
      {
        type: String,
      },
    ],
    hod: {
      type: String,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
