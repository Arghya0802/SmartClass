import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import Resource from "../models/resource.model.js";
import Assignment from "../models/assignment.model.js";
import Solution from "../models/solution.model.js";

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

export const removeSubjectFromDepartment = asyncHandler(
  async (req, res, next) => {
    const { subjectId } = req.body;

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

    const hod = await Teacher.findById(_id);
    const subject = await Subject.findById(subjectId);

    if (!hod || !hod.designation !== "hod" || !subject)
      return next(
        new ApiError(404, "No HoD or Subject found with given credentials!!!")
      );

    if (hod.departmentId !== subject.departmentId)
      return next(
        new ApiError(403, "HoD and Subject must be from same Department!!!")
      );

    const allSubjectTeachers = await Subject.find({
      uniqueId: subject.uniqueId,
    });

    for (const teacher of allSubjectTeachers) {
      const removed = await Subject.findByIdAndDelete(teacher._id);

      if (!removed)
        return next(
          new ApiError(
            500,
            "Somerhing went wrong while calling to the DataBase!!!"
          )
        );
    }

    const allSubjectResources = await Resource.find({
      subjectId: subject.uniqueId,
    });

    for (const resource of allSubjectResources) {
      const removed = await Resource.findByIdAndDelete(resource._id);

      if (!removed)
        return next(
          new ApiError(
            500,
            "Something went wrong while calling to the DataBase!!!"
          )
        );
    }

    const allSubjectAssignments = await Assignment.find({
      subjectId: subject._id,
    });

    for (const assignment of allSubjectAssignments) {
      const removedSolution = await Solution.findOneAndDelete({
        assignmentId: assignment._id,
      });

      if (!removedSolution)
        return next(
          new ApiError(
            500,
            "Something went wrong while calling to the DataBase!!!"
          )
        );

      const removedAssignment = await Assignment.findByIdAndDelete(
        assignment._id
      );

      if (!removedAssignment)
        return next(
          new ApiError(
            500,
            "Something went wrong while calling to the DataBase!!!"
          )
        );
    }

    const removedSubject = await Subject.findByIdAndDelete(subject._id);

    if (!removedSubject)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    return res.status(200).json({
      removedSubject,
      message: "Given Subject has been removed from Department successfully!!!",
      success: true,
    });
  }
);
