import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";
import Resource from "../models/resource.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

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

export const createResource = asyncHandler(async (req, res, next) => {
  const { subjectId, topic } = req.body;

  if (!subjectId || !topic)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  if (
    !req.files ||
    !Array.isArray(req.files.resources) ||
    !req.files.resources.length
  )
    return next(
      new ApiError(400, "Please enter some  Resources before proceeding!!!")
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

  const links = await insertCloudinaryLinks(req.files.resources);

  if (!links)
    return next(
      new ApiError(
        500,
        "Something went wrong while uploading files to Cloudinary!!!"
      )
    );

  const addResource = await Resource.create({
    subjectId,
    topic,
    teacherId: uniqueId,
    links,
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

  const response = await deleteCloudinaryLinks(resource.links);

  if (!response)
    return next(
      new ApiError(
        500,
        "Something went wrong while deleting the uploaded files from Cloudinary!!!"
      )
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
