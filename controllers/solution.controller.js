import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import fs from "fs";

import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Assignment from "../models/assignment.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
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

export const createSolution = asyncHandler(async (req, res, next) => {
  const { assignmentId } = req.params;
  if (
    !req.files ||
    !Array.isArray(req.files.solutions) ||
    !req.files.solutions.length
  )
    return next(
      new ApiError(400, "Please enter some Solutions before proceeding!!!")
    );

  if (!assignmentId)
    return next(
      new ApiError(400, "Please enter all the details before entering!!!")
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

  if (student.departmentId !== teacher.departmentId)
    return next(
      new ApiError(
        401,
        "Cannot submit solution to another Department's Assignment!!!"
      )
    );

  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  const dueDate = assignment.dueDate;
  const [year, month, day] = dueDate.split("-").map(Number);

  if (!(dd <= day && mm <= month && yyyy <= year))
    return next(
      new ApiError(
        403,
        "Cannot submit a solution to an Assignment after its Due Date!!!"
      )
    );

  const solution = await Solution.findOne({
    studentId: student.uniqueId,
    assignmentId,
  });

  // console.log(solutions);
  if (solution) {
    let links = [];
    links.push(solution.link);

    let response = await deleteCloudinaryLinks(links);

    if (!response)
      return next(
        new ApiError(
          500,
          "Something went wrong while deleting the uploaded files from Cloudinary!!!"
        )
      );

    response = await insertCloudinaryLinks(req.files.solutions);

    if (!response)
      return next(
        new ApiError(
          500,
          "Something went wrong while uploading files to Cloudinary!!!"
        )
      );

    solution.link = response[0];
    await solution.save();

    return res.status(200).json({
      solution,
      message: "Files for the given solution updated successfully!!!",
      success: true,
    });
  }

  const response = await insertCloudinaryLinks(req.files.solutions);

  if (!response)
    return next(
      new ApiError(
        500,
        "Something went wrong while uploading files to Cloudinary!!!"
      )
    );

  const newSolution = await Solution.create({
    studentId: student.uniqueId,
    assignmentId,
    link: response[0],
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

  const teacher = await Teacher.findById(_id);

  if (!teacher)
    return next(
      new ApiError(404, "No Teacher found with given credentials!!!")
    );

  const solutions = await Solution.find({ assignmentId });

  if (!solutions)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(200).json({
    solutions,
    message:
      "All the Solutions for the given Assingment fetched successfully!!!",
    success: true,
  });
});

export const getGradeCard = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-token!!!")
    );

  const student = await Student.findById(_id);

  if (!student)
    return next(new ApiError(404, "No student with the given Id exists!!!"));

  const subjects = await Subject.find({ departmentId: student.departmentId });

  let resultSubjects = [];

  for (const ind in subjects) {
    const subject = subjects[ind];
    // console.log(subject);
    const assignments = await Assignment.find({
      subjectId: subject.uniqueId,
      teacherId: subject.teacherId,
    });
    //console.log(assignments);
    if (!assignments) continue;

    for (const index in assignments) {
      const assignment = assignments[index];
      // console.log(assignment);
      const solution = await Solution.findOne({
        assignmentId: assignment._id,
        studentId: student.uniqueId,
      });
      //console.log(solution);

      if (!solution || !solution.marksObtained) continue;

      const existedSubject = resultSubjects.find(
        (obj) => obj.subjectId === subject.uniqueId
      );
      const subjectIndex = resultSubjects.indexOf(existedSubject);

      if (existedSubject) {
        existedSubject.assignments.push({ assignment, solution });
        existedSubject.totalScore =
          existedSubject.totalScore + solution.marksObtained;
        existedSubject.highestScore =
          existedSubject.highestScore + solution.fullMarks;
        resultSubjects[subjectIndex] = existedSubject;
      } else { 
        resultSubjects.push({
          subjectId: subject.uniqueId,
          subjectName: subject.name,
          totalScore: solution.marksObtained,
          highestScore: solution.fullMarks,
          assignments: [{ assignment, solution }],
        });
      }
      //console.log(existedSubject);
    }
  }
  //console.log(resultSubjects)

  return res.status(200).json({
    resultSubjects,
    message:
      "All the Solutions for the given Assingment fetched successfully!!!",
    success: true,
  });
});

export const getGradeCardV2 = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-token!!!")
    );

  const student = await Student.findById(_id);

  if (!student)
    return next(new ApiError(404, "No student with the given Id exists!!!"));

  const assignments = await Assignment.find({ departmentId: student.departmentId });

  let resultSubjects = [];

  for (const ind in assignments) {
    const assignment = assignments[ind];
      // console.log(assignment);
      const solution = await Solution.findOne({
        assignmentId: assignment._id,
        studentId: student.uniqueId,
      });

      const subject = await Subject.findOne({uniqueId: assignment.subjectId, teacherId: assignment.teacherId})

      if (!solution || !solution.marksObtained || !subject) continue;


      let existedSubject = resultSubjects.find(
        (obj) => obj.subjectId === subject.uniqueId
      );
      let subjectIndex = resultSubjects.indexOf(existedSubject);
      
      
      //console.log(existedSubject);
      if (existedSubject) {
        existedSubject.assignments.push({ assignment, solution });
        existedSubject.totalScore =
          existedSubject.totalScore + solution.marksObtained;
        existedSubject.highestScore =
          existedSubject.highestScore + solution.fullMarks;
        resultSubjects[subjectIndex] = existedSubject;
      } else { 
        resultSubjects.push({
          subjectId: subject.uniqueId,
          subjectName: subject.name,
          totalScore: solution.marksObtained,
          highestScore: solution.fullMarks,
          assignments: [{ assignment, solution }],
        });
      }
      //console.log(existedSubject);
    }
  //console.log(resultSubjects)

  return res.status(200).json({
    resultSubjects,
    message:
      "All the Solutions for the given Assingment fetched successfully!!!",
    success: true,
  });
});