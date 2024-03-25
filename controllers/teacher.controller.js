import Teacher from "../models/teacher.model.js";
import Subject from "../models/subject.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Resource from "../models/resource.model.js";

export const addResources = asyncHandler(async (req, res, next) => {
  const { subjectId } = req.body;
  // console.log(subjectId);
  if (!subjectId)
    return next(
      new ApiError(400, "Please enter the Subject-Id before proceeding!!!")
    );

  if (
    !req.files ||
    !Array.isArray(req.files.resources) ||
    !req.files.resources.length
  )
    return next(
      new ApiError(400, "Please enter some Resources before proceeding!!!")
    );

  if (req.files.resources.length > 5)
    return next(
      new ApiError(
        400,
        "Sorry!!! Cannot upload more than 5 files at the same time!!!"
      )
    );

  const { _id, uniqueId } = req.user;
  // console.log(req.user);
  // if (!_id || !unqiueId)
  //   return next(
  //     new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
  //   );

  const teacher = await Teacher.findById(_id);
  const subject = await Subject.findOne({ uniqueId: subjectId });

  if (!teacher || !subject)
    return next(
      new ApiError(404, "No Teacher or Subject found with given credentials!!!")
    );

  let isSubjectPresent = false;

  for (const uniqueId of teacher.subjects) {
    if (uniqueId === subjectId) {
      isSubjectPresent = true;
      break;
    }
  }

  if (!isSubjectPresent)
    return next(
      new ApiError(
        400,
        "Given Subject is currently not assigned to Current Teacher!!!"
      )
    );

  let resourcesLink = [];

  for (let i = 0; i < req.files.resources.length; i++) {
    const localFilePath = req.files.resources[i].path;

    const newResource = await uploadOnCloudinary(localFilePath);

    if (!newResource)
      return next(
        new ApiError(
          500,
          "Sorry!!! Something went wrong while uploading the files at Cloudinary!!!"
        )
      );

    resourcesLink.push(newResource.url);
  }

  let isSubjectAlreadyAdded = false;

  for (let i = 0; i < teacher.resources.length; i++) {
    if (isSubjectAlreadyAdded) break;

    const addedResource = await Resource.findById(
      teacher.resources[i].resourceId
    );

    if (addedResource.subjectId === subjectId) {
      for (let j = 0; j < resourcesLink.length; j++) {
        addedResource.links.push(resourcesLink[j]);
        await addedResource.save();
      }
      isSubjectAlreadyAdded = true;
    }
  }

  if (!isSubjectAlreadyAdded) {
    const newResource = await Resource.create({
      subjectId,
      teacherId: uniqueId,
      links: resourcesLink,
    });

    if (!newResource)
      return next(
        new ApiError(
          500,
          "Something went wrong while adding the given resources to the database!!!"
        )
      );

    teacher.resources.push({ subjectId, resourceId: newResource._id });
    await teacher.save();
    subject.resources.push({
      teacherId: uniqueId,
      resourceId: newResource._id,
    });
    await subject.save();
  }

  return res.status(200).json({
    resourcesLink,
    message:
      "All the Resources of the given Teacher and for the particular Subject has been successfully uploaded!!!",
    success: true,
  });
});
