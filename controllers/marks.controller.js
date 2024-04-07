import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";
import Resource from "../models/resource.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import Solution from "../models/solution.model.js";
import Assignment from "../models/assignment.model.js";

export const assignMarks = asyncHandler(async (req, res, next) => {
  const { solutionId, marks } = req.body;

  if (!solutionId || !marks)
    return next(
      new ApiError(400, "Please enter all the Details before proceeding!!!")
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);
  const solution = await Solution.findById(solutionId);

  if (!teacher || !solution)
    return next(
      new ApiError(
        404,
        "No Teacher or Solution found with given credentials!!!"
      )
    );

  const student = await Student.findOne({ uniqueId: solution.studentId });
  const assignment = await Assignment.findById(solution.assignmentId);

  if (!student || !assignment)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  if (student.departmentId !== teacher.departmentId)
    return next(
      new ApiError(403, "Student and Teacher must be from same Department!!!")
    );

  if (assignment.teacherId !== teacher.uniqueId)
    return next(new ApiError(403, "Access Denied!!!"));

  if (assignment.fullMarks < marks)
    return next(
      new ApiError(
        400,
        "Marks Obtained cannot be greater than Full Marks for the given Assignment!!!"
      )
    );

  solution.marksObtained = marks;
  await solution.save();

  return res.status(200).json({
    solution,
    message: "Marks Updated for the given Assignment successfully!!!",
    success: true,
  });
});
