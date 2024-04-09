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

const insertCloudinaryLinks = async (resources) => {
  try {
    let resourcesLink = [];

    for (let i = 0; i < resources.length; i++) {
      const localFilePath = resources[i].path;

      const newResource = await uploadOnCloudinary(localFilePath);
      // console.log(newResource);
      if (!newResource) {
        return null;
      }

      resourcesLink.push(newResource.url);
    }

    return resourcesLink;
  } catch (error) {
    throw error;
  }
};

const deleteCloudinaryLinks = async (resources) => {
  try {
    for (let i = 0; i < resources.length; i++) {
      const response = await deleteFromCloudinary(resources[i]);

      if (response.result !== "ok") return null;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export const createAssignment = asyncHandler(async (req, res, next) => {
  const { subjectId, fullMarks, dueDate, title } = req.body;

  if (!subjectId || !fullMarks || !dueDate || !title)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  if (
    !req.files ||
    !Array.isArray(req.files.assignments) ||
    !req.files.assignments.length
  )
    return next(
      new ApiError(
        400,
        "Please enter some Assignment Resources before proceeding!!!"
      )
    );

  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);

  if (!teacher)
    return next(
      new ApiError(404, "No Teacher found with given credentials!!!")
    );

  const subject = await Subject.findOne({
    uniqueId: subjectId,
    teacherId: teacher.uniqueId,
  });

  if (!subject)
    return next(
      new ApiError(
        404,
        "No Subject found for the given Teacher with given credentials!!!"
      )
    );

  if (teacher.departmentId !== subject.departmentId)
    return next(
      new ApiError(403, "Teacher and Subject must be from Same Department!!!")
    );

  const links = await insertCloudinaryLinks(req.files.assignments);

  if (!links)
    return next(
      new ApiError(
        500,
        "Something went wrong while uploading files to Cloudinary!!!"
      )
    );

  const newAssignment = await Assignment.create({
    subjectId,
    teacherId: teacher.uniqueId,
    departmentId: teacher.departmentId,
    fullMarks,
    link: links[0],
    dueDate,
    title,
  });

  if (!newAssignment)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

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
    return next(new ApiError(403, "Sorry!!! Access-Denied!!!"));

  const solutions = await Solution.find({ assignmentId });

  for (const solution of solutions) {
    const deletedSolution = await Solution.findByIdAndDelete(solution._id);

    if (!deletedSolution)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );
  }

  const response = await deleteCloudinaryLinks(assignment.links);

  if (!response)
    return next(
      new ApiError(
        500,
        "Something went wrong while deleting the Uploaded files from Cloudinary!!!"
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
    const { subjectId, teacherId } = req.body;

    if (!subjectId || !teacherId)
      return next(
        new ApiError(400, "Please enter all the details before proceeding!!!")
      );

    const { _id, uniqueId } = req.user;

    if (!_id || !uniqueId)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    const teacher = await Teacher.findOne({ uniqueId: teacherId });
    const subject = await Subject.findOne({ uniqueId: subjectId, teacherId });

    if (!teacher || !subject)
      return next(
        new ApiError(
          404,
          "No Teacher or Subject found with given credentials!!!"
        )
      );

    const assignments = await Assignment.find({
      subjectId,
      teacherId,
    });

    let activeAssignments = [];
    let notActiveAssignments = [];

    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    // // Sort notices based on createdAt in descending order
    // assignments.sort((a, b) => b.createdAt - a.createdAt);

    for (const assignment of assignments) {
      const dueDate = assignment.dueDate;
      const [day, month, year] = dueDate.split("/").map(Number);

      if (yyyy <= year && mm <= month && dd <= day)
        activeAssignments.push(assignment);
      else notActiveAssignments.push(assignment);
    }
    // assignments.sort((a, b) => b.createdAt - a.createdAt);
    activeAssignments.sort((a, b) => b.createdAt - a.createdAt);
    notActiveAssignments.sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      activeAssignments,
      notActiveAssignments,
      message:
        "All the Assignments of the given Teacher for the given Subject fetched successfully and divided into Active and Not-Active respectively!!!",
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

  const assignment = await Assignment.findById(solution.assignmentId);

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

  if (student.departmentId !== teacher.departmentId)
    return next(
      new ApiError(
        401,
        "Submitted Solution Student and LoggedIn Teacher must be from same Department!!!"
      )
    );

  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  const dueDate = assignment.dueDate;
  const [day, month, year] = dueDate.split("/").map(Number);

  if (dd <= day && mm <= month && yyyy <= year)
    return next(
      new ApiError(401, "Cannot assign marks till assignment is active!!!")
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

export const getAllActiveAssignmentsOfTeacher = asyncHandler(
  async (req, res, next) => {
    const { subjectId, teacherId } = req.body;

    if (!subjectId || !teacherId)
      return next(
        new ApiError(400, "Please enter all the details before proceeding!!!")
      );

    const { _id, uniqueId } = req.user;

    if (!_id || !uniqueId)
      return next(
        new ApiError(
          500,
          "Something went wrong while decoding Access-Tokens!!!"
        )
      );

    if (uniqueId !== teacherId)
      return next(new ApiError(401, "Access Denied!!!"));

    const teacher = await Teacher.findOne({ uniqueId: teacherId });
    const subject = await Subject.findOne({ uniqueId: subjectId, teacherId });

    if (!teacher || !subject)
      return next(
        new ApiError(
          404,
          "No Teacher or Subject found with given credentials!!!"
        )
      );

    if (teacher.departmentId !== subject.departmentId)
      return next(
        new ApiError(
          403,
          "Teacher and Subject must be from the same Department!!!"
        )
      );

    const assignments = await Assignment.find({
      subjectId,
      teacherId,
    });

    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    const currDate = `${dd}/${mm}/${yyyy}`;
    let activeAssignments = [];
    console.log(currDate);
    for (const assignment of assignments) {
      const dueDate = assignment.dueDate;
      const [day, month, year] = dueDate.split("/").map(Number);

      if (yyyy <= year && mm <= month && dd <= day)
        activeAssignments.push(assignment);
    }

    // Sort notices based on createdAt in descending order
    activeAssignments.sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json({
      activeAssignments,
      message:
        "All Active Assignments for the given Subject and Teacher fetched successfully!!!",
      success: true,
    });
  }
);
