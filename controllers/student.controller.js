import Student from "../models/student.model.js";
import Assignment from "../models/assignment.model.js";
import Solution from "../models/solution.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Teacher from "../models/teacher.model.js";
import Subject from "../models/subject.model.js";
import Feedback from "../models/feedback.model.js";

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

    const solutions = await Solution.find({ studentId: student.uniqueId });
    let activeSubmittedAssignments = [];
    let nonactiveSubmittedAssignments = [];

    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    for (const solution of solutions) {
      const assignment = await Assignment.findById(solution.assignmentId);

      if (!assignment)
        return next(
          new ApiError(
            500,
            "Something went wrong while calling to the DataBase!!!"
          )
        );

        const dueDate = assignment.dueDate;
        const [day, month, year] = dueDate.split("/").map(Number);
  
        if (yyyy <= year && mm <= month && dd <= day)
          activeSubmittedAssignments.push({assignment,solution});
        else nonactiveSubmittedAssignments.push({assignment,solution});
    }

    submittedAssignments.sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      activeSubmittedAssignments,
      nonactiveSubmittedAssignments,
      message:
        "All Submitted Assignments and their Solutions fetched successfully!!!",
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

  const assignments = await Assignment.find();
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  let pendingAssignments = [];

  for (const assignment of assignments) {
    const dueDate = assignment.dueDate;
    const [day, month, year] = dueDate.split("/").map(Number);

    const solution = await Solution.findOne({
      assignmentId: assignment._id,
      studentId: student.uniqueId,
    });

    if (dd <= day && mm <= month && yyyy <= year && !solution)
      pendingAssignments.push(assignment);
  }

  pendingAssignments.sort((a, b) => b.createdAt - a.createdAt);

  return res.status(200).json({
    pendingAssignments,
    message: "All Pending Assignments fetched successfully!!!",
    success: true,
  });
});

export const submitAssignment = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.body;

  if (!assignmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

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

export const getSingleStudent = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const loggedInStudent = await Student.findById(_id);

  if (!loggedInStudent)
    return next(
      new ApiError(404, "No Student found with given credentials!!!")
    );

  return res.status(200).json({
    loggedInStudent,
    message: "LoggedIn Student data successfully fetched from DataBase!!!",
    success: true,
  });
});

export const submitFeedback = asyncHandler(async (req, res, next) => {
  const { teacherId, subjectId, description } = req.body;

  if (!teacherId || !subjectId || !description)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const teacher = await Teacher.findOne({ uniqueId: teacherId });
  const subject = await Subject.findOne({ teacherId, uniqueId: subjectId });

  if (!teacher || !subject)
    return next(
      new ApiError(
        404,
        "No Teacher or Subject found for the given credentials!!!"
      )
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  const student = await Student.findById(_id);

  if (!student)
    return next(
      new ApiError(404, "No Student found with given credentials!!!")
    );

  if (
    student.departmentId !== teacher.departmentId ||
    student.departmentId !== subject.departmentId
  )
    return next(
      new ApiError(
        403,
        "Cannot submit feedback to other Department's Teacher or Subject!!!"
      )
    );

  const newFeedback = await Feedback.create({
    studentId: student.uniqueId,
    teacherId,
    subjectId,
    description,
    departmentId: student.departmentId,
  });

  if (!newFeedback)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(201).json({
    newFeedback,
    message:
      "New Feedback for the given Teacher and Subject has been created successfully!!!",
    success: true,
  });
});

export const getAllMissedAssignments = asyncHandler(async (req, res, next) => {
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

  const assignments = await Assignment.find();
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  let missedAssignments = [];

  for (const assignment of assignments) {
    const dueDate = assignment.dueDate;
    const [day, month, year] = dueDate.split("/").map(Number);

    const solution = await Solution.findOne({
      assignmentId: assignment._id,
      studentId: student.uniqueId,
    });

    if (dd <= day && mm <= month && yyyy <= year) continue;

    if (!solution) missedAssignments.push(assignment);
  }

  missedAssignments.sort((a, b) => b.createdAt - a.createdAt);
  return res.status(200).json({
    missedAssignments,
    message: "All Missed Assignments fetched successfully!!",
    success: true,
  });
});
