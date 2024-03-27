import Teacher from "../models/teacher.model.js";
import Subject from "../models/subject.model.js";
import Resource from "../models/resource.model.js";
import Assignment from "../models/assignment.model.js";

import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import Department from "../models/department.model.js";
import Student from "../models/student.model.js";
import Solution from "../models/solution.model.js";
import Attendance from "../models/attendance.model.js";

const deleteUrls = async (resources) => {
  try {
    for (let i = 0; i < resources.length; i++) {
      const response = await deleteFromCloudinary(resources[i]);

      if (response.result !== "ok") return null;
    }
  } catch (error) {
    throw error;
  }
};

export const addResources = asyncHandler(async (req, res, next) => {
  const { chapter, subjectId } = req.body;
  // console.log(subjectId);
  if (!subjectId || !chapter)
    return next(
      new ApiError(
        400,
        "Please enter the Subject-Id or Chapter-name before proceeding!!!"
      )
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
        "Sorry!!! You can't upload more than 5 files at the same time!!!"
      )
    );

  const { _id, uniqueId } = req.user;
  // console.log(req.user);
  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

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

    if (!newResource) {
      deleteUrls(resourcesLink);
      return next(
        new ApiError(
          500,
          "Sorry!!! Something went wrong while uploading the files at Cloudinary!!!"
        )
      );
    }

    resourcesLink.push(newResource.url);
  }

  isSubjectPresent = false;

  for (let i = 0; i < teacher.resources.length; i++) {
    // if (isSubjectPresent)

    const presentResource = await Resource.findById(
      teacher.resources[i].resourceId
    );

    if (!presentResource) {
      deleteUrls(resourcesLink);
      return next(
        new ApiError(500, "Something went wrong while calling to Cloudinary!!!")
      );
    }

    if (presentResource.subjectId === subjectId) {
      let isChapterAlreadyAdded = false;

      for (let j = 0; j < presentResource.chapters.length; j++) {
        if (presentResource.chapters[j].name === chapter) {
          isChapterAlreadyAdded = true;
          for (let k = 0; k < resourcesLink.length; k++) {
            presentResource.chapters[j].links.push(resourcesLink[k]);
            await presentResource.save();
          }
        }

        if (!isChapterAlreadyAdded) {
          presentResource.chapters.push({
            name: chapter,
            links: resourcesLink,
          });
          await presentResource.save();
        }
      }

      return res.status(200).json({
        resourcesLink,
        message:
          "Given Resources added to Same Chapter of the Same Subject successfully!!!",
        success: true,
      });
    }
  }

  const myObj = {
    name: chapter,
    links: resourcesLink,
  };
  const newResource = await Resource.create({
    subjectId,
    teacherId: uniqueId,
    chapters: myObj,
  });

  if (!newResource) {
    deleteUrls(resourcesLink);
    return next(
      new ApiError(500, "Something went wrong while calling to the DataBase!!!")
    );
  }

  teacher.resources.push({ subjectId, resourceId: newResource._id });
  await teacher.save();
  subject.resources.push({ teacherId: uniqueId, resourceId: newResource._id });
  await subject.save();

  return res.status(200).json({
    resourcesLink,
    message:
      "All the Resources of the given Teacher and for the particular Subject for the Particular Chapter has been successfully uploaded!!!",
    success: true,
  });
});

export const addAssignment = asyncHandler(async (req, res, next) => {
  const { subjectId, fullMarks, title } = req.body;
  // console.log(subjectId);
  if (!subjectId || !fullMarks || !title)
    return next(
      new ApiError(
        400,
        "Please enter the Subject-Id or Full-Marks or Title before proceeding!!!"
      )
    );

  if (
    !req.files ||
    !Array.isArray(req.files.assignments) ||
    !req.files.assignments.length
  )
    return next(
      new ApiError(
        400,
        "Please enter some Assignment Resources before proceeding!!!"
      )
    );

  if (!req.files.assignments.length > 5)
    return next(
      new ApiError(
        400,
        "Sorry!!! Cannot upload more than 5 files at the same time!!!"
      )
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);
  const subject = await Subject.findOne({ uniqueId: subjectId });
  const department = await Department.findOne({ uniqueId: teacher.department });

  if (!department)
    return next(
      new ApiError(
        400,
        "Current Teacher doesn't have any Department assigned!!!"
      )
    );

  if (!teacher || !subject)
    return next(
      new ApiError(404, "No Teacher or Subject found with given credentials!!!")
    );

  if (!teacher.name || !teacher.password)
    return next(new ApiError(400, "Please register yourself first!!!"));

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

  let assignmentResourcesLink = [];

  for (let i = 0; i < req.files.assignments.length; i++) {
    const localFilePath = req.files.assignments[i].path;

    const newAssignmentResource = await uploadOnCloudinary(localFilePath);

    if (!newAssignmentResource)
      return next(
        new ApiError(
          500,
          "Sorry!!! Something went wrong while uploading the files at Cloudinary!!!"
        )
      );

    assignmentResourcesLink.push(newAssignmentResource.url);
  }

  const newCreatedAssignment = await Assignment.create({
    title,
    fullMarks,
    subjectId,
    teacherId: uniqueId,
    links: assignmentResourcesLink,
  });

  if (!newCreatedAssignment)
    return next(
      new ApiError(
        500,
        "Something went wrong while adding the Assignment to the DataBase!!!"
      )
    );

  let isPresent = false;
  for (let j = 0; j < teacher.assignments.length; j++) {
    if (isPresent) break;

    if (subjectId === teacher.assignments[j].subjectId) {
      teacher.assignments[j].assignmentIds.push(newCreatedAssignment._id);
      await teacher.save();
      subject.assignments[j].assignmentIds.push(newCreatedAssignment._id);
      await subject.save();
      isPresent = true;
    }
  }

  if (!isPresent) {
    teacher.assignments.push({
      subjectId,
      assignmentIds: [newCreatedAssignment._id],
    });
    await teacher.save();

    subject.assignments.push({
      teacherId: uniqueId,
      assignmentIds: [newCreatedAssignment._id],
    });
    await subject.save();
  }

  for (let i = 0; i < department.students.length; i++) {
    const student = await Student.findOne({ uniqueId: department.students[i] });

    if (!student)
      return next(
        new ApiError(
          500,
          "Something went wrong while assigning Assignment to Students of Current Department!!!"
        )
      );

    student.pendingAssignments.push(newCreatedAssignment._id);
    await student.save();
  }

  return res.status(201).json({
    newCreatedAssignment,
    message:
      "New Assignment has been created and assigned to all Students of the current Department successfully!!!",
    success: true,
  });
});

export const assignMarks = asyncHandler(async (req, res, next) => {
  const { submissionId, marksObtained } = req.body;

  if (!submissionId || !marksObtained)
    return next(
      new ApiError(400, "Please enter Submission-ID before proceeding!!!")
    );

  const solution = await Solution.findById(submissionId);

  if (!solution)
    return next(new ApiError(404, "No Submission found with given ID!!!"));

  if (solution.fullMarks < marksObtained)
    return next(
      new ApiError(
        400,
        "Marks-Obtained cannot be more than Full-Marks for the given Assignment!!!"
      )
    );

  // if (solution.marksObtained)
  //   return next(
  //     new ApiError(
  //       400,
  //       "Given Student has already been given marks for this particular assignment!!!"
  //     )
  //   );

  solution.marksObtained = marksObtained;
  await solution.save();

  return res.status(200).json({
    solution,
    message: "Marks has been successfully uploaded for the given student!!!",
    success: true,
  });
});

export const getSingleTeacher = asyncHandler(async (req, res, next) => {
  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const loggedInTeacher = await Teacher.findById(_id);

  if (!loggedInTeacher || loggedInTeacher.designation !== "teacher")
    return next(
      new ApiError(404, "No Teacher found with given credentials!!!")
    );

  return res.status(200).json({
    loggedInTeacher,
    message: "LoggedIn Teacher data successfully fetched from DataBase!!!",
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

export const deleteResource = asyncHandler(async (req, res, next) => {
  const { url, subjectId } = req.body;
  // console.log(url, subjectId);
  if (!url || !subjectId)
    return next(
      new ApiError(400, "Please enter all the resources before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);
  const subject = await Subject.findOne({ uniqueId: subjectId });

  if (!teacher || !subject)
    return next(
      new ApiError(404, "No Teacher or Subject found with given credentials!!!")
    );

  // console.log(url);
  if (!teacher.resources.length)
    return next(
      new ApiError(400, "Current Teacher haven't yet added any resources!!!")
    );

  for (let i = 0; i < teacher.resources.length; i++) {
    // if (isPresent) break;

    const resource = await Resource.findById(teacher.resources[i].resourceId);

    if (!resource)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    // console.log(resource.chapters);
    let links = [];
    let response;
    let ind = -1;
    let chapterName;
    for (let j = 0; j < resource.chapters.length; j++) {
      // console.log(resource.chapters[j].links);
      for (let k = 0; k < resource.chapters[j].links.length; k++) {
        // console.log(resource.chapters[j].links[k]);
        if (resource.chapters[j].links[k] === url) {
          ind = j;
          chapterName = resource.chapters[j].name;
          response = await deleteFromCloudinary(url);
        } else links.push(resource.chapters[j].links[k]);
      }
    }

    if (response && ind !== -1) {
      if (!links.length) {
        const removed = await Resource.findByIdAndDelete(resource._id);

        if (!removed)
          return next(
            new ApiError(
              500,
              "Something went wrong while calling to the DataBase!!!"
            )
          );

        const updatedTeacher = await Teacher.findByIdAndUpdate(
          teacher._id,
          {
            $pull: { resources: { resourceIds: resource._id } },
          },
          { new: true }
        );

        if (!updatedTeacher)
          return next(
            new ApiError(
              500,
              "Something went wrong while calling to the DataBase!!!"
            )
          );

        const updatedSubject = await Subject.findByIdAndUpdate(
          subject._id,
          {
            $pull: { resources: { resourceIds: resource._id } },
          },
          { new: true }
        );

        if (!updatedSubject)
          return next(
            new ApiError(
              500,
              "Something went wrong while calling to the DataBase!!!"
            )
          );

        return res.status(200).json({
          removed,
          subjectId,
          chapter: chapterName,
          message:
            "Resource has been successfully deleted and removed from DataBase!!!",
          success: true,
        });
      } else {
        resource.chapters[ind].links = links;
        await resource.save();

        return res.status(200).json({
          resource,
          subjectId,
          chapter: chapterName,
          message: "Resource has been successfully deleted",
          success: true,
        });
      }
    }
  }

  return res.status(404).json({
    message: "No Resource found for the given Teacher and Subject-Id",
    success: false,
  });
});

export const getAllResources = asyncHandler(async (req, res, next) => {
  // const {chapter} = req.params ;

  // if(!chapter)
  //   return next(new ApiError(400, "Please enter all the details before proceeding!!!"))

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);

  if (!teacher)
    return next(new ApiError(404, "No Teacher found for given ID!!!"));

  let resources = [];

  for (let i = 0; i < teacher.resources.length; i++) {
    const presentResource = await Resource.findById(
      teacher.resources[i].resourceId
    );

    if (!presentResource)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    const subject = await Subject.findOne({
      uniqueId: presentResource.subjectId,
    });

    if (!subject)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    for (let j = 0; j < presentResource.chapters.length; j++) {
      resources.push({
        name: subject.name,
        subjectId: subject.uniqueId,
        chapter: presentResource.chapters[j].name,
      });
    }
  }

  return res.status(200).json({
    resources,
    message: "All the Resources of the Current Teacher fetched successfully!!!",
    success: true,
  });
});

export const getAllLinksForChapter = asyncHandler(async (req, res, next) => {
  const { chapter, subjectId } = req.body;
  // console.log(chapter, subjectId);
  if (!chapter || !subjectId)
    return next(
      new ApiError(400, "Please enter all the details before proceeding!!!")
    );

  const { _id, uniqueId } = req.user;

  if (!_id || !uniqueId)
    return next(
      new ApiError(500, "Something went wrong while decoding Access-Tokens!!!")
    );

  const teacher = await Teacher.findById(_id);
  const subject = await Subject.findOne({ uniqueId: subjectId });
  if (!teacher || !subject)
    return next(
      new ApiError(404, "No Teacher or Subject found for given ID!!!")
    );

  let resourcesLink = [];

  for (let i = 0; i < teacher.resources.length; i++) {
    // console.log(teacher.resources[i]);
    if (resourcesLink.length) break;

    const presentResource = await Resource.findById(
      teacher.resources[i].resourceId
    );

    // console.log(presentResource);
    if (!presentResource)
      return next(
        new ApiError(
          500,
          "Something went wrong while calling to the DataBase!!!"
        )
      );

    const id = presentResource.subjectId;
    console.log(id);
    if (id === subjectId) {
      // console.log(presentResource);
      for (let j = 0; j < presentResource.chapters.length; j++) {
        if (presentResource.chapters[j].name === chapter) {
          // console.log(presentResource.chapters[j]);
          resourcesLink = presentResource.chapters[j].links;
        }
      }
    }
  }

  return res.status(200).json({
    resourcesLink,
    message:
      "All the Public URLs for the given Subject's Chapter fetched successfully!!!",
    success: true,
  });
});
