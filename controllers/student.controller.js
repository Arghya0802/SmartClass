import Student from "../models/student.model.js";
import Assignment from "../models/assignment.model.js";
import Solution from "../models/solution.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getAllAssignments = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const student = await Student.findById(_id);

  if (!student)
    return next(
      new ApiError(404, "No Student found with given credentials!!!")
    );

  let allAssignmentLinks = [];

  for (let i = 0; i < student.pendingAssignments.length; i++)
    allAssignmentLinks.push(student.pendingAssignments[i]);

  for (let i = 0; i < student.submittedSolutions.length; i++)
    allAssignmentLinks.push(student.submittedSolutions[i]);

  return res.status(200).json({
    allAssignmentLinks,
    message:
      "Object-Id(s) of all the assignments of given Student(both pending and submitted) fetched successfully!!!",
    success: true,
  });
});

export const getAllSubmittedAssignments = asyncHandler(
  async (req, res, next) => {
    const { _id, uniqueId } = req.user;

    if (!_id || !uniqueId)
      return next(
        new ApiError(
          500,
          "Something went wrong while decoding Access-Tokens!!!"
        )
      );

    const student = await Student.findById(_id);

    if (!student)
      return next(
        new ApiError(404, "No Student found with given credentials!!!")
      );

    const submissions = student.submittedSolutions;
    return res.status(200).json({
      submissions,
      message:
        "Object-Id(s) of all the Submitted-Assignment(s) of given Student fetched successfully!!!",
      success: true,
    });
  }
);

export const getAllPendingAssignments = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const student = await Student.findById(_id);

  if (!student)
    return next(
      new ApiError(404, "No Student found with given credentials!!!")
    );

  const pending = student.pendingAssignments;

  return res.status(200).json({
    pending,
    message:
      "Object-Id(s) of all the Pending-Assignment(s) of given Student fetched successfully!!!",
    success: true,
  });
});

export const submitAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.body;

  if (!assignmentId)
    return next(400, "Please enter all the details before proceeding!!!");

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment)
    return next(new ApiError(404, "No Assignment found with given ID"));

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const student = await Student.findById(_id);

  if (!student)
    return next(
      new ApiError(404, "No Student found with given credentials!!!")
    );

  if (!student.name || !student.password)
    return next(new ApiError(400, "Please register yourself first!!!"));

  let submissionsLink = [];

  if (
    !req.files ||
    !Array.isArray(req.files.submissions) ||
    !req.files.submissions.length
  )
    return next(
      new ApiError(
        400,
        "Please enter some Assignment Resources before proceeding!!!"
      )
    );

  if (!req.files.submissions.length > 7)
    return next(
      new ApiError(
        400,
        "Sorry!!! Cannot upload more than 5 files at the same time!!!"
      )
    );

  for (let i = 0; i < req.files.submissions.length; i++) {
    const localFilePath = req.files.submissions[i].path;

    const newSubmissionResource = await uploadOnCloudinary(localFilePath);

    if (!newSubmissionResource)
      return next(
        new ApiError(
          500,
          "Sorry!!! Something went wrong while uploading the files at Cloudinary!!!"
        )
      );

    submissionsLink.push(newSubmissionResource.url);
  }
  let isAlreadySubmitted = true;

  for (let i = 0; i < student.pendingAssignments.length; i++) {
    if (!isAlreadySubmitted) break;

    const pendingId = student.pendingAssignments[i].toString();

    if (pendingId === assignmentId) {
      isAlreadySubmitted = false;
    }
  }

  if (isAlreadySubmitted) {
    let submittedSolution;

    for (let i = 0; i < student.submittedSolutions.length; i++) {
      if (submittedSolution) break;

      const solution = await Solution.findById(student.submittedSolutions[i]);

      if (!solution)
        return next(
          new ApiError(500, "Something went wrong while accessing DataBase!!!")
        );

      const id = solution.assignment.toString();

      if (id === assignmentId) {
        // if (solution.submissions.length + req.files.submissions.length > 10)
        //   return next(
        //     new ApiError(
        //       400,
        //       "You cannot assign more than 10 solutions for a Single Assignment!!!"
        //     )
        //   );

        submittedSolution = solution;
      }
    }

    for (let i = 0; i < submissionsLink.length; i++) {
      submittedSolution.submissions.push(submissionsLink[i]);
      await submittedSolution.save();
    }

    return res.status(201).json({
      submittedSolution,
      message: "Solutions to the given Assignment is submitted successfully!!!",
      success: true,
    });
  }

  const newSolution = await Solution.create({
    studentId: uniqueId,
    assignment: assignment._id,
    submissions: submissionsLink,
    fullMarks: assignment.fullMarks,
  });

  if (!newSolution)
    return next(
      new ApiError(
        500,
        "Something went wrong while uploading the Solutions to the DataBase!!!"
      )
    );

  assignment.solutions.push(newSolution._id);
  await assignment.save();

  student.submittedSolutions.push(newSolution._id);
  await student.save();

  let updatedAssignmentIds = [];

  for (let i = 0; i < student.pendingAssignments.length; i++) {
    const id = student.pendingAssignments[i].toString();

    if (id !== assignmentId)
      updatedAssignmentIds.push(student.pendingAssignments[i]);
  }

  student.pendingAssignments = updatedAssignmentIds;
  await student.save();

  return res.status(201).json({
    newSolution,
    message:
      "Solution to the Current Assignment has been successfully submitted!!!",
    success: true,
  });
});
