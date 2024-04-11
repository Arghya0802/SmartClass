import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import Resource from "../models/resource.model.js";
import Assignment from "../models/assignment.model.js";
import Solution from "../models/solution.model.js";
import Feedback from "../models/feedback.model.js";

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

  if (existedSubject.teacherId !== teacherId)
    return next(
      new ApiError(
        400,
        "Given Subject is already assigned to Requested Teacher!!!"
      )
    );

  if (!existedSubject.teacherId) {
    existedSubject.teacherId = teacherId;
    await existedSubject.save();
    return res.status(200).json({
      existedSubject,
      message:
        "Given Teacher assigned to given Subject of HoD's Department successfully!!!",
      success: true,
    });
  }

  const newSubject = await Subject.create({
    name: existedSubject.name.toLowerCase(),
    departmentId: existedSubject.departmentId,
    teacherId,
    uniqueId: existedSubject.uniqueId,
  });

  if (!newSubject)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(200).json({
    newSubject,
    message:
      "Given Subject has been assigned to Requested Teacher successfully",
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

    if (!hod || hod.designation !== "hod" || !subject)
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

    console.log(allSubjectTeachers);

    for (const index of allSubjectTeachers) {
      const teacher = allSubjectTeachers[index];
      console.log(teacher);
      const removed = await Subject.findByIdAndDelete(teacher._id);

      if (!removed)
        return next(
          new ApiError(
            500,
            "Somerhing went wrong while calling to the DataBase!!!"
          )
        );
    }

    // const removedSubject = await Subject.findByIdAndDelete(subjectId);

    // if (!removedSubject)
    //   return next(
    //     new ApiError(
    //       500,
    //       "Something went wrong while calling to the DataBase!!!"
    //     )
    //   );

    return res.status(200).json({
      removedSubject,
      message: "Given Subject has been removed from Department successfully!!!",
      success: true,
    });
  }
);

export const getAllFeedbacks = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const hod = await Teacher.findById(_id);

  if (!hod || hod.designation !== "hod")
    return next(new ApiError(404, "No HoD found with given credentials!!!"));

  const allFeedbacks = await Feedback.find({ departmentId: hod.departmentId });

  if (!allFeedbacks)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  // Sort notices based on createdAt in descending order
  allFeedbacks.sort((a, b) => b.createdAt - a.createdAt);

  return res.status(200).json({
    feedbacks: allFeedbacks,
    message: "All Feedbacks for the given Department fetched successfully!!!",
    success: true,
  });
});

export const getAllTeachersDepartment = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const hod = await Teacher.findById(_id);

  if (!hod || hod.designation !== "hod")
    return next(new ApiError(404, "No HoD found with given credentials!!!"));

  const teachers = await Teacher.find({ departmentId: hod.departmentId });

  return res.status(200).json({
    teachers,
    message: "All Teachers of HoD's Department fetched successfully!!!",
    success: true,
  });
});
