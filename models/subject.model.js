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
        if (
          this.uniqueId.length < 3 ||
          this.uniqueId[1] !== "-" ||
          this.uniqueId[0] !== "L"
        )
          return false;
        return true;
      },
    },
    department: {
      type: String,
      required: true,
    },
    teachers: [
      {
        type: String,
      },
    ],

    resources: [
      {
        teacherId: {
          type: String,
          required: true,
        },
        resourceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Resource",
        },
      },
    ],
    assignments: [
      {
        teacherId: {
          type: String,
          required: true,
        },
        assignmentIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
