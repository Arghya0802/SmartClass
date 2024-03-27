import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";
import Resource from "../models/resource.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const getAllResources = asyncHandler(async (req, res, next) => {
    const { _id, uniqueId } = req.user;
  
    if (!_id || !uniqueId)
      return next(
        new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
      );

      const {teacherId} = req.params;
    const resources = await Resource.find({teacherId});
  
    return res.status(200).json({
      resources,
      message:
        "All the Resources successfully fetched !!!",
      success: true,
    });
  });



  export const removeResource = asyncHandler(async (req, res, next) => {
    const { _id, uniqueId } = req.user;
  
    if (!_id || !uniqueId)
      return next(
        new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
      );
  
    const resourceId = req.body;
  
    if (!resourceId)
      return next(
        new ApiError(400, "Please enter all the details before proceeding!!!")
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
  