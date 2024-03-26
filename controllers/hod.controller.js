import Teacher from "../models/teacher.model.js";
import Student from "../models/student.model.js";
import Subject from "../models/subject.model.js";
import Department from "../models/department.model.js";
import Attendance from "../models/attendance.model.js";

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

  if (!hod || !hod.department)
    return next(new ApiError(404, "No HoD found with given details!!!"));

  if (hod.designation !== "hod")
    return next(new ApiError(401, "Un-Authorized Access!!!"));

  const existedSubject = await Subject.findOne({ uniqueId });
  const currentDepartment = hod.department;

  if (existedSubject)
    return next(new ApiError(400, "Subject Unique-Id already exists!!!"));

  if (!currentDepartment)
    return next(
      new ApiError(404, "Sorry!!! No Department found with given HoD!!!")
    );

  for (const subjectId of currentDepartment.subjects) {
    const alreadyAddedSubject = await Subject.findOne({ uniqueId: subjectId });

    // console.log(alreadyAddedSubject.uniqueId);

    if (
      alreadyAddedSubject.name === name ||
      alreadyAddedSubject.uniqueId === uniqueId
    )
      return next(
        new ApiError(
          400,
          "Subject-Id or Subject-Name already exists in the given Department"
        )
      );
  }

  const newSubject = await Subject.create({
    name,
    uniqueId,
    department: currentDepartment.uniqueId,
  });

  if (!newSubject)
    return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

  await Department.findByIdAndUpdate(currentDepartment._id, {
    $push: { subjects: uniqueId },
  });

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

export const giveAttendanceToStudent = asyncHandler(async (req, res, next) => {
  const { studentId, subjectId } = req.body;

  if (!studentId || !subjectId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const student = await Student.findOne({ uniqueId: studentId });
  const subject = await Subject.findOne({ uniqueId: subjectId });
  const teacher = await Teacher.findById(_id);

  if (!student || !teacher || !subject)
    return next(
      new ApiError(404, "Teacher or Student or Subject not found!!!")
    );

  if (student.department !== teacher.department)
    return next(
      new ApiError(
        400,
        "Student and Teacher must be from the Same Department!!!"
      )
    );

  if (!student.name || !student.password)
    return next(
      new ApiError(400, "Only Registered Students can be marked as present!!!")
    );

  let isSubjectPresent = false;

  for (let i = 0; i < teacher.subjects.length; i++) {
    if (isSubjectPresent) break;

    if (teacher.subjects[i] === subjectId) {
      isSubjectPresent = true;
      break;
    }
  }

  if (!isSubjectPresent)
    return next(
      new ApiError(400, "Given Subject is not assigned to LoggedIn Teacher!!!")
    );

  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; // Months are indexed from 0 to 11
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const date = `${year}/${month}/${day}`;
  let isDatePresent = false;
  let markedAttendance;

  for (let i = 0; i < student.datesPresent.length; i++) {
    if (isDatePresent) break;

    if (student.datesPresent[i] === date) isDatePresent = true;
  }
  for (let i = 0; i < student.attendances.length; i++) {
    if (markedAttendance) break;

    const attendace = await Attendance.findById(student.attendances[i]);

    if (!attendace)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    if (attendace.subjectId === subjectId && attendace.teacherId === uniqueId)
      markedAttendance = attendace;
  }

  if (markedAttendance) {
    if (isDatePresent)
      return next(
        new ApiError(
          400,
          "Given Student is already marked present for the Current Lecture"
        )
      );

    student.datesPresent.push(date);
    await student.save();

    markedAttendance.daysPresent += 1;
    await markedAttendance.save();

    return res.status(200).json({
      markedAttendance,
      message:
        "Given Student has been successfully marked present for the current lecture!!!",
      success: true,
    });
  }

  const newAttendance = await Attendance.create({
    subjectId,
    teacherId: uniqueId,
    daysPresent: 1,
  });

  if (!newAttendance)
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );

  student.attendances.push(newAttendance._id);
  await student.save();

  if (!isDatePresent) {
    student.datesPresent.push(date);
    await student.save();
  }
  return res.status(200).json({
    newAttendance,
    message:
      "Given Student has been successfully marked present for this lecture!!!",
    success: true,
  });
});
