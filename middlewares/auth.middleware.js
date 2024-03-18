import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import Admin from "../models/admin.model.js";
import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
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

    if (uniqueId[0] === "A") {
      user = await Admin.findById(_id);
    } else if (uniqueId[0] === "T") {
      user = await Teacher.findById(_id);
    } else if (uniqueId[0] === "S") {
      user = await Student.findById(_id);
    } else return next(new ApiError(400, "Invalid Unique-Id!!!"));

    if (!user)
      return next(
        new ApiError(404, "Sorry!!! No Profile found with given Unique-Id")
      );

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
});
