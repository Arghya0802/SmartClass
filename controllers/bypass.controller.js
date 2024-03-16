import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Admin from "../models/admin.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const addAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, uniqueId } = req.body;

  if (!name || !email || !password || !uniqueId)
    return next(
      new ApiError(401, "Please enter all the details before proceeding!!!")
    );

  const findAdmin = await Admin.findOne({ uniqueId, email });

  if (findAdmin) return next(new ApiError(400, "Admin already exists!!!"));

  const newAdmin = await Admin.create(req.body);

  return res.status(201).json({
    newAdmin,
    message: "Inital Admin (DBA) has been created successfully!!!",
    success: true,
  });
});

export const addStudentList = asyncHandler(async (req, res, next) => {
  const { students } = req.body;

  if (!students)
    return next(new ApiError(400, "Dummy Student List cannot be empty"));

  for (const student of students) {
    const { uniqueId } = student;
    await Student.create({ uniqueId });
  }

  res.status(201).json({
    message: "Dummy Student List has been created successfully!!!",
    success: true,
  });
});

export const addTeacherList = asyncHandler(async (req, res, next) => {
  const { teachers } = req.body;

  if (!teachers)
    return next(new ApiError(400, "Dummy Teacher List cannot be empty!!!"));

  for (const teacher of teachers) {
    const { uniqueId } = teacher;
    await Teacher.create({ uniqueId });
  }

  res.status(201).json({
    message: "Dummy Teacher List has been created successfully!!!",
    success: true,
  });
});
