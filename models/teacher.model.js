import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
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
    password: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      unique: true,
      default: function () {
        // Set the default email value based on uniqueId
        return `${this.uniqueId}@example.com`;
      },
    },
    designation: {
      type: String,
      enum: ["teacher", "hod"],
      default: "teacher",
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
