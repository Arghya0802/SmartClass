import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Assignment from "../models/assignment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Solution from "../models/solution.model.js";

export const createSolution = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;

  if (!assignmentId)
    return next(
      new ApiError(400, "Please enter all the details before entering!!!")
    );

  if (
    !req.files ||
    !Array.isArray(req.files.solutions) ||
    !req.files.solution.length
  )
    return next(
      new ApiError(
        400,
        "Please enter some Assignment Resources before proceeding!!!"
      )
    );

  const localFilePath = req.files.solutions[0].path;

  const response = await uploadOnCloudinary(localFilePath);

  if (!response)
    return next(
      new ApiError(
        500,
        "Something went wrong while uploading files at Cloudinary!!!"
      )
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const assignment = await Assignment.findById(assignmentId);
  const student = await Student.findById(_id);

  if (!assignment || !student)
    return next(
      new ApiError(
        404,
        "No Student or Assignment found with given credentials!!!"
      )
    );

  const teacher = await Teacher.findOne({ uniqueId: assignment.teacherId });

  if (!teacher)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  if (student.department !== teacher.department)
    return next(
      new ApiError(
        401,
        "Cannot submit solution to another Department's Assignment!!!"
      )
    );

  const solutions = await Solution.findOne({
    studentId: student.uniqueId,
    assignment: assignmentId,
  });

  if (solutions)
    return next(
      new ApiError(
        403,
        "LoggedIn Student already has submitted a Solution for the given Assignment"
      )
    );

  const newSolution = await Solution.create({
    studentId: student.uniqueId,
    assignment: assignmentId,
    link: response.url,
    fullMarks: assignment.fullMarks,
  });

  if (!newSolution)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(201).json({
    newSolution,
    message:
      "Solution to the given Assignment has been submitted successfully!!!",
    success: true,
  });
});

export const getAllSolutions = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;

  if (!assignmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment)
    return next(
      new ApiError(404, "No Assignment found with given credentials!!!")
    );

  const { _id } = req.user;

  if (!_id)
    return next(new ApiError(500, "Something went wrong with the token!!!"));
  
  const solutions = await Solution.find({ assignmentId });

  if (!solutions)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(200).json({
    solutions,
    message:
      "All the Solutions for the given Student for the given Subject fetched successfully!!!",
    success: true,
  });
});
