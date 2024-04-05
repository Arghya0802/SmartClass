import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Department from "../models/department.model.js";
import Subject from "../models/subject.model.js";
import Assignment from "../models/assignment.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import Solution from "../models/solution.model.js";

export const createAssignment = asyncHandler(async (req, res, next) => {
  const { subjectId, fullMarks, assignmentLink } = req.params;
  if (!subjectId || !fullMarks || !assignmentLink)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  // if (
  //   !req.files ||
  //   !Array.isArray(req.files.assignment) ||
  //   !req.files.assignment.length
  // )
  //   return next(
  //     new ApiError(
  //       400,
  //       "Please enter some Assignment Resources before proceeding!!!"
  //     )
  //   );

  // const localFilePath = req.files.assignment[0].path;

  // const response = await uploadOnCloudinary(localFilePath);

  // if (!response)
  //   return next(
  //     new ApiError(
  //       500,
  //       "Something went wrong while uploading files at Cloudinary!!!"
  //     )
  //   );

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

  let isSubjectPresent = false;
  for (const id of teacher.subjects) {
    if (isSubjectPresent) break;
    if (id === subject.uniqueId) isSubjectPresent = true;
  }

  if (!isSubjectPresent)
    return next(
      new ApiError(
        403,
        "Current Subject is not assigned to LoggedIn Teacher!!!"
      )
    );

  const newAssignment = await Assignment.create({
    subjectId: subject.uniqueId,
    teacherId: teacher.uniqueId,
    fullMarks,
    link: assignmentLink,
  });

  if (!newAssignment)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  teacher.assignments.push(newAssignment);
  await teacher.save();

  return res.status(201).json({
    newAssignment,
    message: "New Assignment is successfully created!!!",
    success: true,
  });
});

export const removeAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.body;

  if (!assignmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const assignment = await Assignment.findById(assignmentId);
  const teacher = await Teacher.findById(_id);

  if (!assignment || !teacher)
    return next(
      new ApiError(
        404,
        "No Assignment or Teacher found with given credentials!!!"
      )
    );

  if (assignment.teacherId !== teacher.uniqueId)
    return next(new ApiError(401, "Sorry!!! Access-Denied!!!"));

  const allSubmittedSolutions = await Solution.find({
    assignment: assignmentId,
  });

  const response = await deleteFromCloudinary(assignment.link);

  if (!response)
    return next(
      new ApiError(
        500,
        "Something went wrong while deleting the uploaded files from Cloudinary!!!"
      )
    );
  const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

  if (!deletedAssignment)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(200).json({
    deletedAssignment,
    message: "Given Assignment is successfully deleted!!!",
    success: true,
  });
});

export const getAllAssignmentsOfTeacher = asyncHandler(
  async (req, res, next) => {
    const { subjectId } = req.params;
    if (!subjectId)
      return next(
        new ApiError(400, "Please enter all the details before proceeding!!!")
      );

    const { _id } = req.user;

    if (!_id)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    const assignments = await Assignment.find({
      subjectId,
      teacherId: _id,
    });

    if (!assignments)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    return res.status(200).json({
      assignments,
      message:
        "All the Assignments of the given Teacher for the given Subject fetched successfully!!!",
      success: true,
    });
  }
);

export const assignMarksToStudent = asyncHandler(async (req, res, next) => {
  const { solutionId } = req.params;
  const { marks } = req.body;

  if (!solutionId || !marks)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);
  const solution = await Solution.findById(solutionId);

  if (!teacher || !solution)
    return next(
      new ApiError(
        404,
        "No Teacher or Solution found for the given credentials!!!"
      )
    );

  const assignment = await Assignment.findById(solution.assignment);

  if (!assignment)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  if (assignment.teacherId !== teacher.uniqueId)
    return next(new ApiError(403, "Access Denied!!!"));

  const student = await Student.findOne({ uniqueId: solution.studentId });

  if (!student)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  if (student.department !== teacher.department)
    return next(
      new ApiError(
        401,
        "Submitted Solution Student and LoggedIn Teacher must be from same Department!!!"
      )
    );

  solution.marksObtained = marks;
  await solution.save();

  return res.status(200).json({
    solution,
    assignment,
    message: "Marks for the given Solution has been updated successfully!!!",
    success: true,
  });
});
