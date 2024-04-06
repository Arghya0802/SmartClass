import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";
import Resource from "../models/resource.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

function capitalizeWords(input) {
  return input
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word[0].toUpperCase() + word.substr(1);
    })
    .join(" ");
}

export const getAllSubjects = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);

  if (!teacher)
    return next(
      new ApiError(404, "No Teacher found with given credentials!!!")
    );

  const subjects = await Subject.find({ teacherId: teacher.uniqueId });

  for (const subject of subjects) {
    subject.name = capitalizeWords(subject.name);
  }

  return res.status(200).json({
    subjects,
    message: "All Subjects of the LoggedIn Teacher fetched successfully!!!",
    success: true,
  });
});

export const getAllDepartmentSubjects = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const hod = await Teacher.findById(_id);
  const student = await Student.findById(_id);

  if (!hod && !student)
    return next(
      new ApiError(404, "No HoD or Student found with given credentials!!!")
    );

  if (hod && hod.designation !== "hod")
    return next(new ApiError(401, "Access Denied"));

  const subjects = await Subject.find({
    departmentId: hod ? hod.departmentId : student.departmentId,
  });

  for (const subject of subjects) {
    subject.name = capitalizeWords(subject.name);
  }

  return res.status(200).json({
    subjects,
    message: "All Subjects of the LoggedIn Teacher fetched successfully!!!",
    success: true,
  });
});
