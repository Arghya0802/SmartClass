import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";
import Department from "../models/department.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const addTeacherToDataBase = asyncHandler(async (req, res, next) => {
  const { uniqueId, departmentId } = req.body;

  if (!uniqueId || !departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  if (uniqueId[0] !== "T")
    return next(new ApiError(400, "Please enter a Valid Teacher Unique-Id"));

  const department = await Department.findOne({ departmentId });

  if (!department)
    return next(new ApiError(400, "Please enter a valid Department-Id!!!"));

  const newTeacher = await Teacher.create({ uniqueId });

  if (!newTeacher)
    return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(201).json({
    newTeacher,
    message: "Teacher with given Unique-Id successfully entered into DataBase",
    success: true,
  });
});

export const addStudentToDataBase = asyncHandler(async (req, res, next) => {
  const { uniqueId, departmentId } = req.body;

  if (!uniqueId || !departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  if (uniqueId[0] != "S")
    return next(new ApiError(400, "Please enter a Valid Student Unique-Id"));

  const department = await Department.findOne({ departmentId });

  if (!department)
    return next(new ApiError(400, "Please enter a valid Department-Id!!!"));

  const newStudent = await Student.create({ uniqueId });

  if (!newStudent)
    return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(201).json({
    newStudent,
    message: "Student with given Unique-Id successfully entered into DataBase",
    success: true,
  });
});

export const addAdminToDataBase = asyncHandler(async (req, res, next) => {
  const { name, email, password, uniqueId } = req.body;

  if (!uniqueId || !email || !password || !name)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  if (uniqueId[0] !== "A")
    return next(new ApiError(400, "Please enter a Valid Admin Unique-Id"));

  const newAdmin = await Admin.create({ name, email, password, uniqueId });

  if (!newAdmin)
    return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(201).json({
    newAdmin,
    message: "Admin with given Unique-Id successfully entered into DataBase",
    success: true,
  });
});

export const assignHoD = asyncHandler(async (req, res, next) => {
  const { uniqueId } = req.body;

  if (!uniqueId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  if (uniqueId.length < 3 || uniqueId[0] !== "T" || uniqueId[1] !== "-")
    return next(new ApiError(400, "Please enter a Valid Teacher Unique-ID!!!"));

  const existedHoD = await Teacher.findOne({ uniqueId });

  if (!existedHoD)
    return next(new ApiError(404, "Requested Teacher does not exists!!!"));

  if (!existedHoD.name)
    return next(
      new ApiError(400, "Requested Teacher is not yet registered!!!")
    );

  if (existedHoD.designation === "hod")
    return next(
      new ApiError(400, "Given Teacher is already assigned as HoD!!!")
    );

  const newHoD = await Teacher.findByIdAndUpdate(existedHoD._id, {
    designation: "hod",
  });

  if (!newHoD) return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(200).json({
    newHoD,
    message: "HoD assigned successfully!!!",
    success: true,
  });
});

export const addDepartmentToDataBase = asyncHandler(async (req, res, next) => {
  const { name, uniqueId } = req.body;

  if (!uniqueId || !name)
    return next(
      new ApiError(
        400,
        "Please provide all the neccessary details before proceeding!!!"
      )
    );

  const existedDepartment = await Department.findOne({
    $or: [{ name }, { uniqueId }],
  });

  if (existedDepartment)
    return next(
      new ApiError(400, "Department Unique-Id or Name already exists!!!")
    );

  const newDepartment = await Department.create({ name, uniqueId });

  if (!newDepartment)
    return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

  return res.status(201).json({
    newDepartment,
    message: "Department Created Successfully!!!",
    success: true,
  });
});
