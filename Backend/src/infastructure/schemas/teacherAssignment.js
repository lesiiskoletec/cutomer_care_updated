import mongoose from "mongoose";
const { Schema } = mongoose;

const teacherAssignmentSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },

    // Each grade has selected subjectIds (subjectIds are embedded _ids inside Grade.subjects[])
    assignments: [
      {
        gradeId: { type: Schema.Types.ObjectId, ref: "Grade", required: true },
        subjectIds: [{ type: Schema.Types.ObjectId, required: true }],
      },
    ],

    assignedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }, // admin
  },
  { timestamps: true }
);

const TeacherAssignment =
  mongoose.models.TeacherAssignment || mongoose.model("TeacherAssignment", teacherAssignmentSchema);

export default TeacherAssignment;
