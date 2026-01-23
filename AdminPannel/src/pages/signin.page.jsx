import React from "react";
import { Link, useNavigate } from "react-router-dom";
import signimage from "../assets/signimage.png";

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className="hidden md:flex w-full md:w-1/2">
        <img
          src={signimage}
          alt="Sign in illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center items-center bg-white w-full md:w-1/2 p-10">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">Admin Panel</h2>

        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              placeholder="Enter your WhatsApp number"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-1">
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ✅ Forgot password -> OTP page with next=forgotpassword */}
          <div className="text-right mb-6">
            <Link
              to="/otp?next=forgotpassword"
              className="text-sm text-blue-700 font-semibold hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/" className="text-blue-700 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
