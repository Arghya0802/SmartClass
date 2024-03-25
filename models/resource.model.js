import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
