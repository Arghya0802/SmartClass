import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const assignSubjectToTeacher = asyncHandler(async (req, res, next) => {
  const { teacherId, subjectId } = req.body;

  if (!teacherId || !subjectId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const existedTeacher = await Teacher.findOne({ uniqueId: teacherId });
  const existedSubject = await Subject.findOne({ uniqueId: subjectId });

  if (!existedTeacher)
    return next(new ApiError(404, "Sorry!!!Teacher-Id doesn't exists!!!"));

  if (!existedSubject)
    return next(new ApiError(404, "Sorry!!! Subject-Id doesn't exists!!!"));

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(
        500,
        "Something went wrong while decoding Access and Refresh Tokens!!!"
      )
    );

  const hod = await Teacher.findById(_id);

  if (!hod || hod.designation !== "hod")
    return next(new ApiError(404, "No HoD found with given ID"));

  if (hod.departmentId !== existedTeacher.departmentId)
    return next(
      new ApiError(403, "HoD and Teacher's Department are different!!!")
    );

  if (existedSubject.departmentId !== hod.departmentId)
    return next(
      new ApiError(400, "Current Subject doesn't belong to HoD's Department!!!")
    );

  const subjectAssigned = await Subject.findOne({ teacherId });

  if (subjectAssigned)
    return next(
      new ApiError(400, "Given Subject is already assigned to given Teacher!!!")
    );

  existedSubject.teacherId = teacherId;
  await existedSubject.save();

  return res.status(200).json({
    existedSubject,
    message:
      "Given Teacher assigned to given Subject of HoD's Department successfully!!!",
    success: true,
  });
});

export const addSubjectToDepartment = asyncHandler(async (req, res, next) => {
  const { name, uniqueId } = req.body;

  if (!uniqueId || !name)
    return next(
      new ApiError(
        400,
        "Please provide all the neccessary details before proceeding!!!"
      )
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Token")
    );

  const hod = await Teacher.findById(_id);

  if (!hod)
    return next(new ApiError(404, "No HoD found with given details!!!"));

  if (!hod.name || hod.designation !== "hod")
    return next(new ApiError(401, "Un-Authorized Access!!!"));

  const myName = name.toLowerCase();

  const existedSubject = await Subject.findOne({
    $or: [{ uniqueId }, { name: myName }],
  });

  if (existedSubject)
    return next(
      new ApiError(
        400,
        "Subject with given Unique-Id or Name already exists!!!"
      )
    );

  const newSubject = await Subject.create({
    name: myName,
    uniqueId,
    departmentId: hod.departmentId,
  });

  if (!newSubject)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(201).json({
    newSubject,
    message: "Subject Created and added to given Department Successfully!!!",
    success: true,
  });
});

export const getSingleHoD = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const loggedInHoD = await Teacher.findById(_id);

  if (!loggedInHoD || loggedInHoD.designation !== "hod")
    return next(new ApiError(404, "No HoD found with given credentials!!!"));

  return res.status(200).json({
    loggedInHoD,
    message: "LoggedIn HoD data successfully fetched from DataBase!!!",
    success: true,
  });
});
