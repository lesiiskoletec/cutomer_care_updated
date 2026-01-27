import mongoose from "mongoose";
const { Schema } = mongoose;

const gradeSchema = new Schema(
  {
    grade: { type: String, required: true, trim: true, unique: true }, // "5" or "Grade 5"

    subjects: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true }, // subject id inside grade
        subject: { type: String, required: true, trim: true }, // "Sinhala"
        createdAt: { type: Date, default: Date.now },
      },
    ],

    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

gradeSchema.index({ grade: 1 }, { unique: true });

const Grade = mongoose.models.Grade || mongoose.model("Grade", gradeSchema);
export default Grade;
