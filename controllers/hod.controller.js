import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

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

  if (hod.department !== existedTeacher.department)
    return next(
      new ApiError(400, "HoD and Teacher's Department are different!!!")
    );

  // if (
  //   (hod.uniqueId !== existedTeacher.uniqueId) &&
  //   (existedTeacher.designation === "hod")
  // )
  //   return next(
  //     new ApiError(
  //       400,
  //       "Sorry!!! Cannot assign subject to another Department's HoD!!!"
  //     )
  //   );

  if (existedSubject.department !== hod.department)
    return next(
      new ApiError(400, "Current Subject doesn't belong to HoD's Department!!!")
    );

  for (const assignedSubjectId of existedTeacher.subjects) {
    const assignedSubject = await Subject.findOne({
      uniqueId: assignedSubjectId,
    });

    if (
      assignedSubject.name === existedSubject.name ||
      assignedSubject.uniqueId === subjectId
    )
      return next(
        new ApiError(
          400,
          "Given Subject Name or Subject Unique-Id is already assigned to the Current Teacher!!!"
        )
      );
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    existedTeacher._id,
    {
      $push: { subjects: subjectId },
    },
    { new: true }
  );

  const updatedSubject = await Subject.findByIdAndUpdate(existedSubject._id, {
    $push: { teachers: teacherId },
  });

  if (!updatedTeacher || !updatedSubject)
    return next(
      new ApiError(
        500,
        "Sorry!!! Something went wrong while updating Teacher or Subject!!!"
      )
    );

  return res.status(200).json({
    teacherId,
    subjectId,
    message:
      "Given Teacher assigned to given Subject of HoD's Department successfully!!!",
    success: true,
  });
});
