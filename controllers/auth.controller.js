import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, uniqueId } = req.body;

  if (!name || !email || !password || !uniqueId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const post = uniqueId[0];

  if (post === "T") {
    const existedTeacher = await Teacher.findOne({ uniqueId });

    if (!existedTeacher)
      return next(new ApiError(400, "No Teacher found with given Unique-Id"));

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      existedTeacher._id,
      req.body
    );

    return res.status(200).json({
      updatedTeacher,
      message: "Teacher with given Unique-ID registered successfully!!!",
      success: true,
    });
  }

  if (post === "S") {
    const existedStudent = await Student.findOne({ uniqueId });

    if (!existedStudent)
      return next(new ApiError(400, "No Teacher found with given Unique-Id"));

    const updatedStudent = await Student.findByIdAndUpdate(
      existedStudent._id,
      req.body
    );

    return res.status(200).json({
      updatedStudent,
      message: "Student with given Unique-ID registered successfully!!!",
      success: true,
    });
  }

  return res.status(400).json({
    message: "Please enter a valid Unique-Id",
    success: false,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { uniqueId, password } = req.body;

  if (!uniqueId || !password)
    return next(
      new ApiError(
        "Please enter all the neccessary details before proceeding!!!"
      )
    );

  const post = uniqueId[0];
  if (post !== "A" && post !== "T" && post !== "S")
    return next(new ApiError(401, "Please enter a valid Unique-Id"));

  if (post === "A") {
    const findAdmin = await Admin.findOne({ uniqueId });

    if (!findAdmin)
      return next(new ApiError(401, "No Admin found with given Unique-Id"));

    return res.status(200).json({
      findAdmin,
      message: "Admin found Successfullly",
      designation: "admin",
      success: true,
    });
  }

  if (post === "T") {
    const findTeacher = await Teacher.findOne({ uniqueId });

    if (!findTeacher)
      return next(new ApiError(401, "No Teacher found with given Unique-Id"));

    const isHoD = findTeacher.designation === "hod";

    return res.status(200).json({
      findTeacher,
      message: "Teacher found Successfullly",
      designation: isHoD ? "hod" : "teacher",
      success: true,
    });
  }

  if (post === "S") {
    const findStudent = await Student.findOne({ uniqueId });

    if (!findStudent)
      return next(new ApiError(401, "No Student found with given Unique-Id"));

    return res.status(200).json({
      findStudent,
      message: "Student found Successfullly",
      designation: "student",
      success: true,
    });
  }

  return res.status(500).json({
    message: "Sorry!!! Internal Server Error!!!",
    success: false,
  });
});
