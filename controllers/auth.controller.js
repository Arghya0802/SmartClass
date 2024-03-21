import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";

const generateAccessAndRefreshTokens = async (userId, User) => {
  try {
    const user = await User.findById(userId);
    // console.log(user);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    // console.log(accessToken, refreshToken);
    user.refreshToken = refreshToken;
    // Before saving data into our MongoDB, we don't need Password, UserName validations
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    // console.log(error);
    return next(new ApiError(500, error));
  }
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, uniqueId } = req.body;

  if (!name || !email || !password || !uniqueId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const findTeacher = await Teacher.findOne({ email });
  const findStudent = await Student.findOne({ email });
  const findAdmin = await Admin.findOne({ email });

  if (findAdmin || findTeacher || findStudent)
    return next(
      new ApiError(400, "Sorry!!! Email-ID is already registered!!!")
    );

  const post = uniqueId[0];

  if (post === "T") {
    const existedTeacher = await Teacher.findOne({ uniqueId });

    if (!existedTeacher)
      return next(new ApiError(404, "No Teacher found with given Unique-Id"));

    const hashed = await bcrypt.hash(password, 10);
    const updatedTeacher = await Teacher.findByIdAndUpdate(existedTeacher._id, {
      name,
      email,
      password: hashed,
    });

    if (!updatedTeacher)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    return res.status(200).json({
      updatedTeacher,
      message: "Teacher with given Unique-ID registered successfully!!!",
      success: true,
    });
  }

  if (post === "S") {
    const existedStudent = await Student.findOne({ uniqueId });

    if (!existedStudent)
      return next(new ApiError(404, "No Student found with given Unique-Id"));

    const hashed = await bcrypt.hash(password, 10);

    const updatedStudent = await Student.findByIdAndUpdate(existedStudent._id, {
      name,
      email,
      password: hashed,
    });

    if (!updatedStudent)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    return res.status(200).json({
      updatedStudent,
      message: "Student with given Unique-ID registered successfully!!!",
      success: true,
    });
  }

  return res.status(400).json({
    message: "Please enter a valid Unique-Id",
    success: false,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const { uniqueId, password } = req.body;

  if (!uniqueId || !password)
    return next(
      new ApiError(
        400,
        "Please enter all the neccessary details before proceeding!!!"
      )
    );

  const post = uniqueId[0];
  // if (post !== "A" && post !== "T" && post !== "S")
  //   return next(new ApiError(400, "Please enter a valid Unique-Id"));

  if (post === "A") {
    const admin = await Admin.findOne({ uniqueId });

    // console.log(admin._id);
    if (!admin)
      return next(new ApiError(404, "No Admin found with given Unique-Id"));

    const isValid = await admin.isPasswordCorrect(password);

    if (!isValid)
      return next(new ApiError(401, "Please enter Correct Password!!!"));
    // console.log(user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin._id,
      Admin
    );
    // console.log(accessToken);
    // console.log(refreshToken);
    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    if (!loggedInAdmin)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    // Options are designed so that cookies are edited from server-side only
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        loggedInAdmin,
        accessToken,
        refreshToken,
        designation: "admin",
        message: "Admin Logged-In Successfully",
        designation: "admin",
        success: true,
      });
  }

  if (post === "T") {
    const teacher = await Teacher.findOne({ uniqueId });

    if (!teacher)
      return next(new ApiError(400, "No Teacher found with given Unique-Id"));

    const isValid = await teacher.isPasswordCorrect(password);

    if (!isValid)
      return next(new ApiError(400, "Please enter Correct Password!!!"));
    // console.log(user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      teacher._id,
      Teacher
    );
    // console.log(accessToken);
    // console.log(refreshToken);
    const loggedInTeacher = await Teacher.findById(teacher._id).select(
      "-password"
    );

    if (!loggedInTeacher)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    // Options are designed so that cookies are edited from server-side only
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        loggedInTeacher,
        accessToken,
        refreshToken,
        designation: loggedInTeacher.designation,
        message: "Teacher Logged-In Successfully",
        designation: loggedInTeacher.designation,
        success: true,
      });
  }

  if (post === "S") {
    const student = await Student.findOne({ uniqueId });

    if (!student)
      return next(new ApiError(400, "No Student found with given Unique-Id"));

    const isValid = await student.isPasswordCorrect(password);

    if (!isValid)
      return next(new ApiError(400, "Please enter Correct Password!!!"));
    // console.log(user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      student._id,
      Student
    );
    // console.log(accessToken);
    // console.log(refreshToken);
    const loggedInStudent = await Student.findById(student._id).select(
      "-password"
    );

    if (!loggedInStudent)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    // Options are designed so that cookies are edited from server-side only
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        loggedInStudent,
        accessToken,
        refreshToken,
        designation: "student",
        message: "Student Logged-In Successfully",
        designation: "student",
        success: true,
      });
  }

  return res.status(400).json({
    message: "Please enter a Valid Unique-Id",
    success: false,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const { _id, uniqueId } = user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(
        500,
        "Something went wrong while decoding the Access-Token!!!"
      )
    );

  const options = {
    httpOnly: true,
    secure: true,
  };

  if (uniqueId[0] === "A") {
    const loggedOutAdmin = await Admin.findByIdAndUpdate(
      _id,
      {
        $set: {
          refreshToken: "EMPTY",
        },
      },
      { new: true }
    );

    if (!loggedOutAdmin)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        id: _id,
        uniqueId: uniqueId,
        message: "Admin logged out successfully",
        success: true,
      });
  }

  if (uniqueId[0] === "T") {
    const loggedOutTeacher = await Teacher.findByIdAndUpdate(
      _id,
      {
        $set: {
          refreshToken: "EMPTY",
        },
      },
      { new: true }
    );

    if (!loggedOutTeacher)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        id: _id,
        uniqueId: uniqueId,
        message: "Teacher logged out successfully",
        success: true,
      });
  }

  if (uniqueId[0] === "S") {
    const loggedOutStudent = await Student.findByIdAndUpdate(
      _id,
      {
        $set: {
          refreshToken: "EMPTY",
        },
      },
      { new: true }
    );

    if (!loggedOutStudent)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        id: _id,
        uniqueId: uniqueId,
        message: "Student logged out successfully",
        success: true,
      });
  }

  return res.status(500).json({
    message: "Sorry!!!Something went wrong while logging out User!!!",
    success: false,
  });
});
