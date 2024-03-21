import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Admin from "../models/admin.model.js";
import Department from "../models/department.model.js";
import Subject from "../models/subject.model.js";

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
    const { uniqueId, departmentId } = student;
    await Student.create({ uniqueId, department: departmentId });
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
    const { uniqueId, departmentId } = teacher;
    await Teacher.create({ uniqueId, department: departmentId });
  }

  res.status(201).json({
    message: "Dummy Teacher List has been created successfully!!!",
    success: true,
  });
});

export const addDepartmentList = asyncHandler(async (req, res, next) => {
  const { departments } = req.body;

  if (!departments)
    return next(new ApiError(400, "Dummy Department List cannot be empty!!!"));

  for (const department of departments) {
    const { name, uniqueId } = department;
    await Department.create({ name, uniqueId });
  }

  res.status(201).json({
    message: "Dummy Department List has been created successfully!!!",
    success: true,
  });
});

export const addSubjectList = asyncHandler(async (req, res, next) => {
  const { subjects } = req.body;

  if (!subjects)
    return next(new ApiError(400, "Dummy Subject List cannot be empty!!!"));

  for (const subject of subjects) {
    const { uniqueId, name, departmentId } = subject;
    await Subject.create({ name, uniqueId, department: departmentId });
    await Department.findOneAndUpdate(
      { uniqueId: departmentId },
      {
        $push: { subjects: uniqueId },
      },
      { new: true }
    );
  }

  res.status(201).json({
    message:
      "Dummy Subject List has been created and added to respective Department successfully!!!",
    success: true,
  });
});
