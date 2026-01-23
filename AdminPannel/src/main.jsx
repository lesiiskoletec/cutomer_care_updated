import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import SignUpPage from "./pages/signup.page";
import SignInPage from "./pages/signin.page";
import OTPPage from "./pages/OTP.page";
import ForgotPassword from "./pages/Forgotpassword";
import HomePage from "./pages/home.page";

import PaperLayout from "./layout/PaperLayout";
import PapersPage from "./pages/papers.page";
import ViewPaperPage from "./pages/ViewPaperPage";

import TeacherLayout from "./layout/TeacherLayout";
import TeacherPage from "./pages/Teacher.page";
import ViewTeacherPage from "./pages/ViewTeacher.page";

import StudentsPage from "./pages/Students.page";
import LMSPage from "./pages/lms.page";
import GradeSubjectPage from "./pages/Grade.Subject.page";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/lms" element={<LMSPage />} />
        <Route path="/grade-subject" element={<GradeSubjectPage />} />

        {/* STUDENT */}
        <Route path="/student" element={<StudentsPage />} />

        {/* PAPER FLOW */}
        <Route path="/paper" element={<PaperLayout />}>
          <Route index element={<Navigate to="/paper/papers" replace />} />
          <Route path="papers" element={<PapersPage />} />
          <Route path="view" element={<ViewPaperPage />} />
        </Route>

        {/* TEACHER FLOW */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="/teacher/list" replace />} />
          <Route path="list" element={<TeacherPage />} />
          <Route path="view" element={<ViewTeacherPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
