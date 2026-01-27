import express from "express";
import { authenticate } from "../api/middlewares/authentication.js";
import { authorize } from "../api/middlewares/authrization.js";

import {
  getTeachers,
  assignGradesSubjectsToTeacher,
  getTeacherAssignment,
} from "../application/teacherAssignment.js";

const router = express.Router();

// ✅ list teachers
// /api/teacher?status=pending | approved | all
router.get("/", authenticate, authorize(["admin"]), getTeachers);

// ✅ assign grades + subjects
router.post("/assign", authenticate, authorize(["admin"]), assignGradesSubjectsToTeacher);

// ✅ get teacher assignments (teacher details + assignments)
router.get("/:teacherId/assignment", authenticate, authorize(["admin"]), getTeacherAssignment);

export default router;
