import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    daysPresent: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
