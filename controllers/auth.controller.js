import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendMail } from "../utils/sendMail.js";
import { generateOtp } from "../utils/generateOtp.js";

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
  const { name, email, password, uniqueId, gender, DOB, phone } = req.body;

  if (!name || !email || !password || !uniqueId || !gender || !DOB || !phone)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const [year, month, date] = DOB.split("-").map(Number);

  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  let age = yyyy - year;

  if (month < mm) age++;
  else if (month === mm && dd <= date) age++;

  if (age < 18)
    return next(
      new ApiError(400, "Need to be atleast 18 yrs age to register!!!")
    );

  const findTeacher = await Teacher.findOne({ $or: [{ email }, { phone }] });
  const findStudent = await Student.findOne({ $or: [{ email }, { phone }] });
  const findAdmin = await Admin.findOne({ $or: [{ email }, { phone }] });
  // console.log(findAdmin , findTeacher , findStudent);
  if (findAdmin || findTeacher || findStudent)
    return next(
      new ApiError(
        400,
        "Sorry!!! Email-ID or Mobile Number is already registered!!!"
      )
    );

  const post = uniqueId[0];

  if (post === "T") {
    const existedTeacher = await Teacher.findOne({ uniqueId });

    if (!existedTeacher)
      return next(new ApiError(404, "No Teacher found with given Unique-Id"));
    console.log(existedTeacher.name);
    if (existedTeacher.name || existedTeacher.password)
      return next(
        new ApiError(400, "Requested User has already been registered!!!")
      );

    const hashed = await bcrypt.hash(password, 10);
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      existedTeacher._id,
      {
        name,
        email,
        password: hashed,
        age,
        DOB,
        gender,
        phone,
      },
      { new: true }
    );

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

    if (existedStudent.name || existedStudent.password)
      return next(
        new ApiError(400, "Requested User has already been registered!!!")
      );

    const hashed = await bcrypt.hash(password, 10);

    const updatedStudent = await Student.findByIdAndUpdate(
      existedStudent._id,
      {
        name,
        email,
        password: hashed,
        age,
        gender,
        phone,
        DOB,
      },
      { new: true }
    );

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

  // Options are designed so that cookies are edited from server-side only

  // TODO: Change the httpOnly: true before publishing
  const options = {
    httpOnly: false, // Change it to true before publishing
    secure: true,
  };
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
    const loggedInAdmin = await Admin.findById(admin._id).select(
      "-refreshToken"
    );

    if (!loggedInAdmin)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

    // Options are designed so that cookies are edited from server-side only
    const options = {
      httpOnly: false,
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
      return next(new ApiError(404, "No Teacher found with given Unique-Id"));

    const isValid = await teacher.isPasswordCorrect(password);

    if (!isValid)
      return next(new ApiError(401, "Please enter Correct Password!!!"));
    // console.log(user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      teacher._id,
      Teacher
    );
    // console.log(accessToken);
    // console.log(refreshToken);
    const loggedInTeacher = await Teacher.findById(teacher._id).select(
      "-refreshToken"
    );

    if (!loggedInTeacher)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

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
        success: true,
      });
  }

  if (post === "S") {
    const student = await Student.findOne({ uniqueId });

    if (!student)
      return next(new ApiError(404, "No Student found with given Unique-Id"));

    const isValid = await student.isPasswordCorrect(password);

    if (!isValid)
      return next(new ApiError(401, "Please enter Correct Password!!!"));
    // console.log(user);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      student._id,
      Student
    );
    // console.log(accessToken);
    // console.log(refreshToken);
    const loggedInStudent = await Student.findById(student._id).select(
      "-refreshToken"
    );

    if (!loggedInStudent)
      return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

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

  // TODO: Change the httpOnly to true before publishing
  const options = {
    httpOnly: false, // Change it to true before publishing the website
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

export const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return next(new ApiError(401, "Un-Authorized Access!!!"));
  // TODO:

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Token")
    );

  const { _id, uniqueId } = decoded;

  if (!_id || !uniqueId)
    return next(
      new ApiError(
        500,
        "Something went wrong while decoding the Access-Token!!!"
      )
    );

  let user;
  if (uniqueId[0] === "A") user = await Admin.findById(_id);
  else if (uniqueId[0] === "T") user = await Teacher.findById(_id);
  else if (uniqueId[0] == "S") user = await Student.findById(_id);
  else return next(new ApiError(400, "Please enter a Valid Unique-Id"));

  if (user)
    return res.status(200).json({
      message: "Access Token is validated!!!",
      designation:
        user.uniqueId[0] === "A"
          ? "admin"
          : user.uniqueId[0] === "S"
          ? "student"
          : user.designation,
      success: true,
    });

  return res.status(500).json({
    message: "Access Token is not validated!!!",
    success: false,
  });
});

export const viewProfile = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  if (!_id)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const admin = await Admin.findById(_id);
  const teacher = await Teacher.findById(_id);
  const student = await Student.findById(_id);

  if (!admin && !teacher && !student)
    return next(
      new ApiError(
        404,
        "No Admin or HoD or Teacher or Student found with given credentials!!!"
      )
    );

  let user = admin ? admin : teacher ? teacher : student;

  return res.status(200).json({
    user,
    message: "LoggedIn User profile fetched successfully!!!",
    success: true,
  });
});

export const sendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ApiError(400, "Please enter your email!"));
  }
  let teacher = await Teacher.findOne({ email });

  if (!teacher) {
    return next(new ApiError(404, "User not found!"));
  }

  const otp = generateOtp();
  const isMailSent = await sendMail(email, otp);
  if (!isMailSent) {
    return next(new ApiError(500, "Can't send email!"));
  }

  if (req.cookies.otp) {
    req.cookies.otp = "";
  }

  res.cookie("otp", otp, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 3600 * 24),
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Otp sent successfully",
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { otp, email, password } = req.body;
  const actualOtp = req.cookies.otp;
  if (!actualOtp) {
    return next(
      new ApiError(400, "Otp has expired, resend otp to your email!")
    );
  }
  if (actualOtp !== otp) {
    return next(new ApiError(400, "Incorrect otp!"));
  }

  const teacher = await Teacher.findOne({ email });
  const student = await Student.findOne({ email });
  const admin = await Admin.findOne({ email });

  if (admin) {
    const hashed = await bcrypt.hash(password, 10);

    admin.password = hashed;
    await admin.save();

    return res.status(200).json({
      admin,
      message: "Admin password successfully updated!!!",
      success: true,
    });
  }

  if (teacher) {
    const hashed = await bcrypt.hash(password, 10);

    teacher.password = hashed;
    await teacher.save();

    return res.status(200).json({
      teacher,
      message: "Teacher password successfully updated!!!",
      success: true,
    });
  }

  if (student) {
    const hashed = await bcrypt.hash(password, 10);

    student.password = hashed;
    await student.save();

    return res.status(200).json({
      student,
      message: "Student password successfully updated!!!",
      success: true,
    });

    return res.status(404).json({
      message: "No User found with given email ID!!!",
      success: false,
    });
  }
});
