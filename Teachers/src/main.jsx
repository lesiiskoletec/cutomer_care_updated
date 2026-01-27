import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import SignUpPage from "./pages/signup.page";
import SignInPage from "./pages/signin.page";
import OTPPage from "./pages/OTP.page";
import ForgotPassword from "./pages/Forgotpassword";
import HomePage from "./pages/home.page";
import Studentspage from "./pages/students.page";
import PaperReport from "./pages/paper.Report";
import ClassReport from "./pages/Class.Report.page";
import Result from "./pages/Result.page";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/student" element={<Studentspage />} />
        <Route path="/paper" element={<PaperReport />} />
        <Route path="/class" element={<ClassReport />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
