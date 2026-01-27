import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OTPPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const next = searchParams.get("next"); // "forgotpassword" or null

  const handleVerify = () => {
    if (next === "forgotpassword") {
      navigate("/forgotpassword");
    } else {
      // default flow (signup OTP -> signin)
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Check your WhatsApp and enter the verification code
        </p>

        <div className="flex justify-between gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OTPPage;
