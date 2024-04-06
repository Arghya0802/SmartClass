import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    topic: {
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
      required: true,
    },
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
