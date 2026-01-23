import React from "react";

const TeacherPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#F7F6F6] px-3 py-6">
      {/* PAGE TITLE (TOP) */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center mb-8">
        Teachers Assign the Subjects
      </h1>

      {/* CARD CENTER ONLY */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <form className="space-y-4">
            {/* Teachers name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Teachers name
              </label>
              <input
                type="text"
                placeholder="Enter teacher name"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                placeholder="9477XXXXXXX"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Available grade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Available grade
              </label>
              <select className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Select</option>
                {[...Array(13)].map((_, i) => (
                  <option key={i}>Grade {i + 1}</option>
                ))}
              </select>
            </div>

            {/* Available subjects */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Available subjects
              </label>
              <select className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Select</option>
                <option>Maths</option>
                <option>Science</option>
                <option>English</option>
                <option>ICT</option>
                <option>History</option>
                <option>Sinhala</option>
                <option>Tamil</option>
              </select>
            </div>

            {/* SUBMIT */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-4 py-2 text-white font-extrabold hover:bg-blue-800 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
