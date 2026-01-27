import express from "express";
import { authenticate } from "../api/middlewares/authentication.js";
import { authorize } from "../api/middlewares/authrization.js";

import {
  createGrade,
  createSubject,
  getAllGradeAndSubjects,
  getSubjectsByGradeId,
  deleteSubjectByGradeId,
} from "../application/grade.js";

const router = express.Router();

// ✅ 1) create grade
router.post("/creategrade", authenticate, authorize(["admin"]), createGrade);

// ✅ 2) create subject inside grade
router.post("/createsubject", authenticate, authorize(["admin"]), createSubject);

// ✅ 3) get all grade + subjects
router.get("/getallgradeandsubjects", authenticate, authorize(["admin"]), getAllGradeAndSubjects);

// ✅ 4) get subjects by grade id
router.get("/getsubjectsbygrade/:gradeId", authenticate, authorize(["admin"]), getSubjectsByGradeId);

// ✅ 5) delete subject by grade id + subject id
router.delete(
  "/deletesubjectbygrade/:gradeId/:subjectId",
  authenticate,
  authorize(["admin"]),
  deleteSubjectByGradeId
);

export default router;
