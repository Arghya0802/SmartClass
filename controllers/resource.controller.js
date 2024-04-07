import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";
import Resource from "../models/resource.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const createResource = asyncHandler(async (req, res, next) => {
  const { subjectId, link, topic } = req.body;

  if (!subjectId || !link || !topic)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);
  const subject = await Subject.findOne({ uniqueId: subjectId });

  if (!teacher)
    return next(
      new ApiError(404, "No Teacher found with given credentials!!!")
    );

  if (teacher.departmentId !== subject.departmentId)
    return next(
      new ApiError(
        403,
        "Teacher and Subject should be from the same Department!!!"
      )
    );

  const addResource = await Resource.create({
    subjectId,
    topic,
    teacherId: uniqueId,
    link,
  });

  if (!addResource)
    return next(
      new ApiError(
        500,
        "Something went wrong while removing the Student from DataBase!!!"
      )
    );

  return res.status(200).json({
    addResource,
    message: "Requested Resource has been successfully created!!!",
    success: true,
  });
});

export const getAllResources = asyncHandler(async (req, res, next) => {
  const { subjectId, teacherId } = req.body;

  if (!subjectId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findOne({ uniqueId: teacherId });
  const subject = await Subject.findOne({ uniqueId: subjectId });

  if (!teacher || !subject)
    return next(
      new ApiError(404, "No Teacher or Subject found with given credentials!!!")
    );

  if (teacher.departmentId !== subject.departmentId)
    return next(
      new ApiError(403, "Student and Teacher must be from Same Department!!!")
    );

  const resources = await Resource.find({
    teacherId,
    subjectId,
  });

  return res.status(200).json({
    resources,
    message:
      "All the Resources for the given Teacher and Subject successfully fetched!!!",
    success: true,
  });
});

export const removeResource = asyncHandler(async (req, res, next) => {
  const { resourceId } = req.body;

  if (!resourceId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const resource = await Resource.findById(resourceId);
  const teacher = await Teacher.findById(_id);

  if (!resource || !teacher)
    return next(
      new ApiError(
        404,
        "No Resource or Teacher found for the given credentials!!!"
      )
    );

  if (resource.teacherId !== teacher.uniqueId)
    return next(
      new ApiError(403, "Requested Resource must be from the same Teacher!!!")
    );

  const deletedResource = await Resource.findByIdAndDelete(resourceId);

  if (!deletedResource)
    return next(
      new ApiError(
        500,
        "Something went wrong while removing the Student from DataBase!!!"
      )
    );

  return res.status(200).json({
    deletedResource,
    message: "Requested Resource has been successfully deleted!!!",
    success: true,
  });
});

//fdhjkfs
