import mongoose from "mongoose";
import Grade from "../infastructure/schemas/grade.js";

// ✅ CREATE GRADE
export const createGrade = async (req, res) => {
  try {
    const { grade } = req.body;

    if (!grade) return res.status(400).json({ message: "grade is required" });

    const newGrade = await Grade.create({
      grade: String(grade).trim(),
      subjects: [],
      createdBy: req.user?.id || null,
    });

    return res.status(201).json({ message: "Grade created", grade: newGrade });
  } catch (err) {
    console.error("createGrade error:", err);
    if (err.code === 11000) return res.status(409).json({ message: "Grade already exists" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ CREATE SUBJECT (INSIDE GRADE)
export const createSubject = async (req, res) => {
  try {
    const { gradeId, subject } = req.body;

    if (!gradeId || !subject) {
      return res.status(400).json({ message: "gradeId and subject are required" });
    }

    const grade = await Grade.findById(gradeId);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    // prevent duplicate subject name in same grade
    const exists = grade.subjects.some(
      (s) => s.subject.toLowerCase() === String(subject).trim().toLowerCase()
    );
    if (exists) return res.status(409).json({ message: "Subject already exists in this grade" });

    grade.subjects.push({
      subject: String(subject).trim(),
    });

    await grade.save();

    return res.status(201).json({
      message: "Subject added to grade",
      gradeId: grade._id,
      subjects: grade.subjects,
    });
  } catch (err) {
    console.error("createSubject error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET ALL GRADES + SUBJECTS
export const getAllGradeAndSubjects = async (req, res) => {
  try {
    const data = await Grade.find().sort({ createdAt: 1 });
    return res.status(200).json({ grades: data });
  } catch (err) {
    console.error("getAllGradeAndSubjects error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET SUBJECTS BY GRADE ID
export const getSubjectsByGradeId = async (req, res) => {
  try {
    const { gradeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gradeId)) {
      return res.status(400).json({ message: "Invalid gradeId" });
    }

    const grade = await Grade.findById(gradeId);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    return res.status(200).json({
      gradeId: grade._id,
      grade: grade.grade,
      subjects: grade.subjects,
    });
  } catch (err) {
    console.error("getSubjectsByGradeId error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ DELETE SUBJECT BY GRADE ID + SUBJECT ID
export const deleteSubjectByGradeId = async (req, res) => {
  try {
    const { gradeId, subjectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gradeId)) {
      return res.status(400).json({ message: "Invalid gradeId" });
    }
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: "Invalid subjectId" });
    }

    const grade = await Grade.findById(gradeId);
    if (!grade) return res.status(404).json({ message: "Grade not found" });

    const before = grade.subjects.length;

    grade.subjects = grade.subjects.filter((s) => String(s._id) !== String(subjectId));

    if (grade.subjects.length === before) {
      return res.status(404).json({ message: "Subject not found in this grade" });
    }

    await grade.save();

    return res.status(200).json({
      message: "Subject deleted from grade",
      gradeId: grade._id,
      subjects: grade.subjects,
    });
  } catch (err) {
    console.error("deleteSubjectByGradeId error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
