import Teacher from "../models/teacher.model.js";
import Department from "../models/department.model.js";

import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import Notice from "../models/notice.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";

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

export const addNoticeToDepartment = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;

  if (!title)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;
  // console.log(req.user);
  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const hod = await Teacher.findById(_id);

  if (!hod || hod.designation !== "hod")
    return next(new ApiError(404, "No HoD found with given credentials!!!"));

  let links = [];

  if (req.files && Array.isArray(req.files.links) && req.files.links.length) {
    links = await insertCloudinaryLinks(req.files.links);
    if (!links)
      return next(
        new ApiError(
          500,
          "Something went wrong while uploading files to Cloudinary!!!"
        )
      );
  }

  const department = await Department.findOne({ uniqueId: hod.departmentId });

  if (!department)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  if (department.hod !== hod.uniqueId)
    return next(new ApiError(403, "Access Denied!!!"));

  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  const currDate = `${dd}/${mm}/${yyyy}`;

  const newNotice = await Notice.create({
    title,
    description: description ? description : "",
    link: links[0],
    departmentId: department.uniqueId,
    hodId: hod.uniqueId,
    postDate: currDate,
  });

  if (!newNotice)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  return res.status(201).json({
    newNotice,
    message: "New Notice has been added successfully!!!",
    success: true,
  });
});

export const getAllNotices = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;
  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const admin = await Admin.findById(_id);

  if (!admin)
    return next(new ApiError(404, "No Admin found with given credentials!!!"));

  const allNotices = await Notice.find();

  if (!allNotices)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );
  // Sort notices based on createdAt in descending order
  allNotices.sort((a, b) => b.createdAt - a.createdAt);

  return res.status(200).json({
    allNotices,
    message: "All Notices for the University fetched successfully!!!",
    success: true,
  });
});

export const getAllDepartmentNotices = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;
  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);
  const student = await Student.findById(_id);

  if (!teacher && !student)
    return next(
      new ApiError(
        404,
        "No HoD or Teacher or Student found with given credentials!!!"
      )
    );

  const allNotices = await Notice.find({
    departmentId: teacher ? teacher.departmentId : student.departmentId,
  });

  if (!allNotices)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  // Sort notices based on createdAt in descending order
  allNotices.sort((a, b) => b.createdAt - a.createdAt);

  return res.status(200).json({
    allNotices,
    message: "All Notices for the Department fetched successfully!!!",
    success: true,
  });
});

export const removeNoticeFromDepartment = asyncHandler(
  async (req, res, next) => {
    const { noticeId } = req.body;

    if (!noticeId)
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
    const notice = await Notice.findById(noticeId);

    if (!hod || hod.designation !== "hod" || !notice)
      return next(
        new ApiError(404, "No HoD or Notice found with given credentials!!!")
      );

    if (notice.hodId != hod.uniqueId)
      return next(
        new ApiError(403, "Cannot Delete other Department's Notice!!!")
      );

    const response = await deleteCloudinaryLinks(notice.links);

    if (!response)
      return next(
        new ApiError(
          500,
          "Something went wrong while removing deleted files from Cloudinary!!!"
        )
      );

    const removedNotice = await Notice.findByIdAndDelete(noticeId);

    if (!removedNotice)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    return res.status(200).json({
      removedNotice,
      message: "Given Notice has been successfully deleted!!!",
      success: true,
    });
  }
);
