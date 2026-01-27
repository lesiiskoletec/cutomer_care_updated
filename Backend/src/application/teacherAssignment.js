import mongoose from "mongoose";
import User from "../infastructure/schemas/user.js";
import Grade from "../infastructure/schemas/grade.js";
import TeacherAssignment from "../infastructure/schemas/teacherAssignment.js";

const safeTeacher = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phonenumber: u.phonenumber,
  role: u.role,
  isVerified: u.isVerified,
  verifiedAt: u.verifiedAt,
  isApproved: u.isApproved,
  approvedAt: u.approvedAt,
  approvedBy: u.approvedBy,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

// ✅ 1) Admin: list teachers (approved / pending)
export const getTeachers = async (req, res) => {
  try {
    const { status } = req.query; // pending | approved | all

    const filter = { role: "teacher" };

    if (status === "pending") filter.isApproved = false;
    else if (status === "approved") filter.isApproved = true;

    // optionally show only verified teachers
    // filter.isVerified = true;

    const teachers = await User.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ teachers: teachers.map(safeTeacher) });
  } catch (err) {
    console.error("getTeachers error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ 2) Admin: assign grades + subjects to a teacher
export const assignGradesSubjectsToTeacher = async (req, res) => {
  try {
    const { teacherId, assignments } = req.body;

    if (!teacherId) return res.status(400).json({ message: "teacherId is required" });
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return res.status(400).json({ message: "assignments array is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacherId" });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (!teacher.isApproved) {
      return res.status(403).json({ message: "Teacher must be approved before assigning" });
    }

    // ✅ Validate each grade + subjectIds exist inside Grade.subjects[]
    for (const a of assignments) {
      if (!a.gradeId || !Array.isArray(a.subjectIds)) {
        return res.status(400).json({ message: "Each assignment must have gradeId and subjectIds[]" });
      }

      if (!mongoose.Types.ObjectId.isValid(a.gradeId)) {
        return res.status(400).json({ message: `Invalid gradeId: ${a.gradeId}` });
      }

      const grade = await Grade.findById(a.gradeId);
      if (!grade) return res.status(404).json({ message: `Grade not found: ${a.gradeId}` });

      const gradeSubjectIds = new Set(grade.subjects.map((s) => String(s._id)));

      for (const sid of a.subjectIds) {
        if (!mongoose.Types.ObjectId.isValid(sid)) {
          return res.status(400).json({ message: `Invalid subjectId: ${sid}` });
        }
        if (!gradeSubjectIds.has(String(sid))) {
          return res.status(400).json({
            message: `SubjectId ${sid} does not belong to grade ${grade.grade}`,
          });
        }
      }
    }

    // ✅ Upsert assignment doc
    const doc = await TeacherAssignment.findOneAndUpdate(
      { teacherId },
      {
        teacherId,
        assignments,
        assignedBy: req.user?.id || null,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({ message: "Teacher assignments saved", assignment: doc });
  } catch (err) {
    console.error("assignGradesSubjectsToTeacher error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ 3) Admin: get teacher assignment with teacher + readable grade+subjects
export const getTeacherAssignment = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacherId" });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") return res.status(404).json({ message: "Teacher not found" });

    const assignment = await TeacherAssignment.findOne({ teacherId }).lean();

    // ✅ Convert subjectIds to subject names using Grade.subjects[]
    let readable = [];
    if (assignment?.assignments?.length) {
      for (const a of assignment.assignments) {
        const grade = await Grade.findById(a.gradeId).lean();
        if (!grade) continue;

        const subjectsMap = new Map(grade.subjects.map((s) => [String(s._id), s.subject]));
        readable.push({
          gradeId: grade._id,
          grade: grade.grade,
          subjects: a.subjectIds.map((sid) => ({
            _id: sid,
            subject: subjectsMap.get(String(sid)) || "Unknown",
          })),
        });
      }
    }

    return res.status(200).json({
      teacher: safeTeacher(teacher),
      assignment: assignment || null,
      readableAssignments: readable,
    });
  } catch (err) {
    console.error("getTeacherAssignment error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
