// TODO: DELETE TESTING ROUTES POSITIVELY

// import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import { connectDB } from "./db/Connection_DB.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";

const PORT = process.env.PORT || 3000;

// // middlewares
// app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(cookieParser());

// Basic configuration set-up to receive JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// Database Connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// Add Initial Admins
import bypassRouter from "./routes/bypass.routes.js";
app.use("/api/v1/bypass", bypassRouter);

// Auth Routes
import authRouter from "./routes/auth.routes.js";
app.use("/api/v1/auth", authRouter);

// Admin Routes
import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRouter);

//Resource routes
import resourceRouter from "./routes/resource.routes.js";
app.use("/api/v1/resource", resourceRouter);

// HoD Routes
import hodRouter from "./routes/hod.routes.js";
app.use("/api/v1/hod", hodRouter);

// Teacher Routes
import teacherRouter from "./routes/teacher.routes.js";
app.use("/api/v1/teacher", teacherRouter);

// Student Routes
import studentRouter from "./routes/student.routes.js";
app.use("/api/v1/student", studentRouter);

// Assignment Routes
import assignmentRouter from "./routes/assignment.routes.js";
app.use("/api/v1/assignment", assignmentRouter);

// Solution Routes
import solutionRouter from "./routes/solution.routes.js";
app.use("/api/v1/solution", solutionRouter);

// Subject Routes
import subjectRouter from "./routes/subject.routes.js";
app.use("/api/v1/subject", subjectRouter);

// Marks Routes
import marksRouter from "./routes/marks.routes.js";
app.use("/api/v1/marks", marksRouter);

// Notice Routes
import noticeRouter from "./routes/notice.routes.js";
app.use("/api/v1/notice", noticeRouter);

// Error Handler Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

