import Teacher from "../models/teacher.model.js";
import Admin from "../models/admin.model.js";
import Student from "../models/student.model.js";
import Department from "../models/department.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";

export const addTeacherToDataBase = asyncHandler(async (req, res, next) => {
  const { uniqueId, departmentId } = req.body;

  if (!uniqueId || !departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  // if (
  //   uniqueId[0] !== "T" ||
  //   departmentId[0] !== "D" ||
  //   uniqueId[1] !== "-" ||
  //   departmentId[1] !== "-"
  // )
  //   return next(
  //     new ApiError(400, "Please enter a Valid Teacher or Department Unique-Id")
  //   );

  const teacher = await Teacher.findOne({ uniqueId });
  const department = await Department.findOne({ uniqueId: departmentId });

  if (!department)
    return next(new ApiError(404, "No Department found with given Unique-Id"));

  if (teacher)
    return next(
      new ApiError(400, "Teacher with given Unique-Id already exists!!!")
    );

  const newTeacher = await Teacher.create({
    uniqueId,
    department: departmentId,
  });

  if (!newTeacher)
    return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  department.teachers.push(uniqueId);
  await department.save();

  return res.status(201).json({
    newTeacher,
    message: "Teacher with given Unique-Id created successfully!!!",
    success: true,
  });
});

export const addStudentToDataBase = asyncHandler(async (req, res, next) => {
  const { uniqueId, departmentId } = req.body;

  if (!uniqueId || !departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  // if (
  //   uniqueId[0] !== "T" ||
  //   departmentId[0] !== "D" ||
  //   uniqueId[1] !== "-" ||
  //   departmentId[1] !== "-"
  // )
  //   return next(
  //     new ApiError(400, "Please enter a Valid Teacher or Department Unique-Id")
  //   );

  const department = await Department.findOne({ uniqueId: departmentId });
  const student = await Student.findOne({ uniqueId });

  if (!department)
    return next(new ApiError(400, "Please enter a valid Department-Id!!!"));

  if (student)
    return next(
      new ApiError(400, "Student with given Unique-Id already exists!!!")
    );

  const newStudent = await Student.create({
    uniqueId,
    department: departmentId,
  });

  if (!newStudent)
    return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  department.students.push(uniqueId);
  await department.save();

  return res.status(201).json({
    newStudent,
    message:
      "Student with given Unique-Id successfully created and added to given Department!!!",
    success: true,
  });
});

export const addAdminToDataBase = asyncHandler(async (req, res, next) => {
  const { name, email, password, uniqueId } = req.body;

  if (!uniqueId || !email || !password || !name)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  // if (uniqueId[0] !== "A")
  //   return next(new ApiError(400, "Please enter a Valid Admin Unique-Id"));

  const existedAdmin = await Admin.findOne({ uniqueId });

  if (existedAdmin)
    return next(
      new ApiError(400, "Admin with given Unique-Id already exists!!!")
    );

  const findAdmin = await Admin.findOne({ email });
  const findTeacher = await Teacher.findOne({ email });
  const findStudent = await Student.findOne({ email });

  if (findAdmin || findStudent || findTeacher)
    return next(
      new ApiError(400, "Email-ID is already present in our DataBase!!!")
    );

  const newAdmin = await Admin.create({ name, email, password, uniqueId });

  if (!newAdmin)
    return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(201).json({
    newAdmin,
    message: "Admin with given Unique-Id successfully created!!!",
    success: true,
  });
});

export const assignHoD = asyncHandler(async (req, res, next) => {
  const { uniqueId } = req.body;

  if (!uniqueId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  // if (uniqueId.length < 3 || uniqueId[0] !== "T" || uniqueId[1] !== "-")
  //   return next(new ApiError(400, "Please enter a Valid Teacher Unique-ID!!!"));

  const existedHoD = await Teacher.findOne({ uniqueId });

  if (!existedHoD)
    return next(new ApiError(404, "Given Teacher-Id not found!!!"));

  if (!existedHoD.name || !existedHoD.password)
    return next(
      new ApiError(400, "Requested Teacher is not yet registered!!!")
    );

  // if (!existedHoD.department)
  //   return next(new ApiError(400, "Given Teacher"));

  if (existedHoD.designation === "hod")
    return next(
      new ApiError(400, "Given Teacher is already assigned as HoD!!!")
    );

  const department = await Department.findOne({
    uniqueId: existedHoD.department,
  });

  if (department.hod)
    return next(new ApiError(400, "Given Department already has an HoD!!!"));

  const newHoD = await Teacher.findByIdAndUpdate(existedHoD._id, {
    designation: "hod",
  });

  department.hod = newHoD.uniqueId;
  await department.save();

  if (!newHoD) return next(new ApiError(500, "Sorry!!! Internal Server Error"));

  return res.status(200).json({
    newHoD,
    message: "HoD assigned successfully to his/her own Department!!!",
    success: true,
  });
});

export const addDepartmentToDataBase = asyncHandler(async (req, res, next) => {
  const { name, uniqueId } = req.body;

  if (!uniqueId || !name)
    return next(
      new ApiError(
        400,
        "Please provide all the neccessary details before proceeding!!!"
      )
    );

  if (uniqueId.length < 3 || uniqueId[1] !== "-" || uniqueId[0] !== "D")
    return next(new ApiError(400, "Please enter a valid Department-ID"));

  const existedDepartment = await Department.findOne({
    $or: [{ name }, { uniqueId }],
  });

  if (existedDepartment)
    return next(
      new ApiError(400, "Department Unique-Id or Name already exists!!!")
    );

  const newDepartment = await Department.create({ name, uniqueId });

  if (!newDepartment)
    return next(new ApiError(500, "Sorry!!! Internal Server Error!!!"));

  return res.status(201).json({
    newDepartment,
    message: "Department Created Successfully!!!",
    success: true,
  });
});

export const removeHoD = asyncHandler(async (req, res, next) => {
  const { uniqueId } = req.body;

  if (!uniqueId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const existedHoD = await Teacher.findOne({ uniqueId });

  if (!existedHoD || existedHoD.designation !== "hod")
    return next(new ApiError(404, "No HoD found with given Unique-Id"));

  const department = await Department.findOne({
    uniqueId: existedHoD.department,
  });

  if (!department.hod)
    return next(new ApiError(400, "Given Department doesn't have any HoD!!!"));

  const changedHoD = await Teacher.findByIdAndUpdate(
    existedHoD._id,
    {
      designation: "teacher",
    },
    { new: true }
  );

  department.hod = "";
  await department.save();

  return res.status(200).json({
    changedHoD,
    message:
      "Given HoD has been removed from the current Department!!! Please now assign a New HoD to the Current Department",
    success: true,
  });
});

export const removeAdmin = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access Tokens!!!")
    );

  const { adminId } = req.body;

  if (!adminId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const loggedInAdmin = await Admin.findById(_id);
  const aboutToBeDeletedAdmin = await Admin.findById(adminId);

  if (!loggedInAdmin || !aboutToBeDeletedAdmin)
    return next(
      new ApiError(404, "No Admin(s) found with given credientials!!!")
    );

  // console.log(loggedInAdmin.uniqueId);
  // console.log(aboutToBeDeletedAdmin.uniqueId);

  if (loggedInAdmin.uniqueId === aboutToBeDeletedAdmin.uniqueId)
    return next(
      new ApiError(400, "Sorry!!! No Admin can delete themselves!!!")
    );

  if (loggedInAdmin.createdAt > aboutToBeDeletedAdmin.createdAt)
    return next(
      new ApiError(
        500,
        "Sorry!!! You are not Authorized to delete an Older and more Experienced Admin!!!"
      )
    );

  const deletedAdmin = await Admin.findByIdAndDelete(adminId);

  if (!deletedAdmin)
    return next(
      new ApiError(
        500,
        "Something went wrong while removing the Admin from DataBase!!!"
      )
    );

  return res.status(200).json({
    deletedAdmin,
    message: "Requested Admin has been successfully deleted!!!",
    success: true,
  });
});

export const getAllAdmins = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const admin = await Admin.findById(_id);

  if (!admin)
    return next(new ApiError(404, "No Admin found with given credentials!!!"));

  const admins = await Admin.find();

  if (!admins)
    return next(
      new ApiError(
        500,
        "Something went wrong while retriving all the Admin data from DataBase!!!"
      )
    );

  return res.status(200).json({
    admins,
    message: "Admins list successfully retrived!!!",
    success: true,
  });
});

export const getSingleAdmin = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const loggedInAdmin = await Admin.findById(_id);

  if (!loggedInAdmin)
    return next(new ApiError(404, "No Admin found with given credentials!!!"));

  return res.status(200).json({
    loggedInAdmin,
    message: "LoggedIn Admin data successfully fetched from DataBase!!!",
    success: true,
  });
});

export const getAllStudents = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const admin = await Admin.findById(_id);

  if (!admin)
    return next(new ApiError(404, "No Admin found with given credentials!!!"));

  const students = await Student.find();

  if (!students)
    return next(
      new ApiError(500, "Something went wrong while calling to DataBase!!!")
    );

  let registered = [],
    notRegistered = [];

  for (let i = 0; i < students.length; i++) {
    if (students[i].name && students[i].password) registered.push(students[i]);
    else notRegistered.push(students[i]);
  }

  return res.status(200).json({
    registered,
    notRegistered,
    message:
      "All the Students successfully fetched and segregated into Registered and Not Registered successfully!!!",
    success: true,
  });
});

export const getAllTeachers = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const admin = await Admin.findById(_id);

  if (!admin)
    return next(new ApiError(404, "No Admin found with given credentials!!!"));

  const teachers = await Teacher.find();

  if (!teachers)
    return next(
      new ApiError(500, "Something went wrong while calling to DataBase!!!")
    );

  let registered = [],
    notRegistered = [];

  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i].name && teachers[i].password) registered.push(teachers[i]);
    else notRegistered.push(teachers[i]);
  }

  return res.status(200).json({
    registered,
    notRegistered,
    message:
      "All the Teachers successfully fetched and segregated into Registered and Not Registered successfully!!!",
    success: true,
  });
});

export const getAllDepartments = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const admin = await Admin.findById(_id);

  if (!admin)
    return next(new ApiError(404, "No Admin found with given credentials!!!"));

  const departments = await Department.find();

  if (!departments)
    return next(
      new ApiError(500, "Something went wrong while calling to DataBase!!!")
    );

  for (let i = 0; i < departments.length; i++) {
    if (!departments[i].hod) departments[i].hod = "No HoD assigned yet!!!";
  }

  return res.status(200).json({
    departments,
    message: "All Departments fetched successfully!!!",
    success: true,
  });
});

export const getStudentsOfDepartment = asyncHandler(async (req, res, next) => {
  const { departmentId } = req.params;

  if (!departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const admin = await Admin.findById(_id);

  if (!admin) return next(new ApiError(404, "No Admin found with given ID!!!"));

  const department = await Department.findOne({ uniqueId: departmentId });

  if (!department)
    return next(new ApiError(404, "No Department found with given ID!!!"));

  if (!department.students.length)
    return res.status(200).json({
      message: "No Student is yet assigned to Current Department",
      success: false,
    });

  let registered = [],
    notRegistered = [];

  // console.log(department.students);

  for (let i = 0; i < department.students.length; i++) {
    const student = await Student.findOne({ uniqueId: department.students[i] });

    if (!student)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    if (student.name && student.password) registered.push(student);
    else {
      student.name = "Student yet to be registered";
      notRegistered.push(student);
    }
  }
  return res.status(200).json({
    registered,
    notRegistered,
    message:
      "All Students of given Department fetched and segregrated into Registered and Not Registered successfully!!!",
    success: true,
  });
});

export const getTeachersOfDepartment = asyncHandler(async (req, res, next) => {
  const { departmentId } = req.params;

  if (!departmentId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const admin = await Admin.findById(_id);

  if (!admin) return next(new ApiError(404, "No Admin found with given ID!!!"));

  const department = await Department.findOne({ uniqueId: departmentId });

  if (!department)
    return next(new ApiError(404, "No Department found with given ID!!!"));

  let registered = [],
    notRegistered = [];

  if (!department.teachers.length)
    return res.status(200).json({
      message: "No Teacher is yet assigned in the current Department",
      success: false,
    });
  // console.log(department.teachers);

  for (let i = 0; i < department.teachers.length; i++) {
    const teacher = await Teacher.findOne({ uniqueId: department.teachers[i] });

    if (!teacher)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    if (teacher.name && teacher.password) registered.push(teacher);
    else {
      teacher.name = "Teacher yet to be registered";
      notRegistered.push(teacher);
    }
  }

  return res.status(200).json({
    registered,
    notRegistered,
    message:
      "All Teachers of given Department fetched and segregrated into Registered and Not Registered successfully!!!",
    success: true,
  });
});
