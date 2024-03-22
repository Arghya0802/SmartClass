import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";
import Department from "../models/department.model.js";
import Subject from "../models/subject.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const addTeacherToDataBase = asyncHandler(async (req, res, next) => {
  const { uniqueId, departmentId } = req.body;

  if (!uniqueId || !departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  // if (
  //   uniqueId[0] !== "T" ||
  //   departmentId[0] !== "D" ||
  //   uniqueId[1] !== "-" ||
  //   departmentId[1] !== "-"
  // )
  //   return next(
  //     new ApiError(400, "Please enter a Valid Teacher or Department Unique-Id")
  //   );

  const teacher = await Teacher.findOne({ uniqueId });
  const department = await Department.findOne({ uniqueId: departmentId });

  if (!department)
    return next(new ApiError(404, "No Department found with given Unique-Id"));

  if (teacher)
    return next(
      new ApiError(400, "Teacher with given Unique-Id already exists!!!")
    );

  const newTeacher = await Teacher.create({
    uniqueId,
    department: departmentId,
  });

  if (!newTeacher)
    return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(201).json({
    newTeacher,
    message:
      "Teacher with given Unique-Id and Department successfully entered into DataBase",
    success: true,
  });
});

export const addStudentToDataBase = asyncHandler(async (req, res, next) => {
  const { uniqueId, departmentId } = req.body;

  if (!uniqueId || !departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  // if (
  //   uniqueId[0] !== "T" ||
  //   departmentId[0] !== "D" ||
  //   uniqueId[1] !== "-" ||
  //   departmentId[1] !== "-"
  // )
  //   return next(
  //     new ApiError(400, "Please enter a Valid Teacher or Department Unique-Id")
  //   );

  const department = await Department.findOne({ uniqueId: departmentId });
  const student = await Student.findOne({ uniqueId });

  if (!department)
    return next(new ApiError(400, "Please enter a valid Department-Id!!!"));

  if (student)
    return next(
      new ApiError(400, "Student with given Unique-Id already exists!!!")
    );

  const newStudent = await Student.create({
    uniqueId,
    department: departmentId,
  });

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

  const existedAdmin = await Admin.findOne({ $or: [{ uniqueId }, { email }] });

  if (existedAdmin)
    return next(
      new ApiError(400, "Admin with given Unique-Id or Email already exists!!!")
    );

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

  // if (uniqueId.length < 3 || uniqueId[0] !== "T" || uniqueId[1] !== "-")
  //   return next(new ApiError(400, "Please enter a Valid Teacher Unique-ID!!!"));

  const existedHoD = await Teacher.findOne({ uniqueId });

  if (!existedHoD)
    return next(new ApiError(404, "Requested Teacher does not exists!!!"));

  if (!existedHoD.name)
    return next(
      new ApiError(400, "Requested Teacher is not yet registered!!!")
    );

  if (!existedHoD.department)
    return next(new ApiError(400, "Given Department already has an HoD!!!"));

  if (existedHoD.designation === "hod")
    return next(
      new ApiError(400, "Given Teacher is already assigned as HoD!!!")
    );

  const newHoD = await Teacher.findByIdAndUpdate(existedHoD._id, {
    designation: "hod",
  });

  const updatedDepartment = await Department.findByIdAndUpdate(
    newHoD.department._id,
    {
      hod: existedHoD.uniqueId,
    },
    { new: true }
  );

  if (!newHoD) return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(200).json({
    newHoD,
    updatedDepartment,
    message: "HoD assigned successfully to his/her own Department!!!",
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

export const removeHoD = asyncHandler(async (req, res, next) => {
  const { uniqueId } = req.body;

  if (!uniqueId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const existedHoD = await Teacher.findOne({ uniqueId });

  if (!existedHoD || existedHoD.designation !== "hod")
    return next(new ApiError(404, "No HoD found with given Unique-Id"));

  const changedHoD = await Teacher.findByIdAndUpdate(
    existedHoD._id,
    {
      designation: "teacher",
    },
    { new: true }
  );

  const updatedDepartment = await Department.findByIdAndUpdate(
    existedHoD.department._id,
    {
      hod: "",
    },
    { new: true }
  );

  return res.status(200).json({
    changedHoD,
    updatedDepartment,
    message:
      "Given HoD has been removed from the current Department!!! Please now assign a New HoD to the Current Department",
    success: true,
  });
});
