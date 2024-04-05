import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";
import Department from "../models/department.model.js";
import Subject from "../models/subject.model.js";

export const createAssignment = asyncHandler(async (req, res, next) => {
  const { subjectId } = req.params;
  if (!subjectId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const subject = await Subject.findById(subjectId);
  const teacher = await Teacher.findById(_id);

  if (!subject || !teacher)
    return next(
      new ApiError(404, "No Teacher or Subject found with given credentials!!!")
    );
});
