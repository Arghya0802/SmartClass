import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    departmentId: {
      type: String,
      required: true,
    },
    hodId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 100,
      //   required: true,
    },
    links: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
