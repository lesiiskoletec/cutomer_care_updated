import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../compoments/TopBar";

import papers from "../assets/papers.png";
import student from "../assets/student.png";
import teacher from "../assets/teacher.png";
import subject from "../assets/subject.png";

const HomePage = () => {
  const navigate = useNavigate();

  const Card = ({ img, title, to }) => (
    <div
      onClick={() => navigate(to)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(to)}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 hover:shadow-lg transition duration-200 cursor-pointer aspect-square active:scale-[0.99]"
    >
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div>
          {/* ✅ KEEP IMAGE SIZE SAME */}
          <img src={img} alt={title} className="w-50 h-50 object-contain" />
        </div>

        {/* ✅ ONLY TEXT STYLE CHANGED (SIZE SAME = text-base) */}
        <h3
          className="
            text-base font-bold text-gray-900
            tracking-wide uppercase
            relative mt-2
            [text-shadow:0_1px_0_rgba(255,255,255,0.9),0_6px_14px_rgba(0,0,0,0.12)]
            after:content-[''] after:block after:mx-auto after:mt-1
            after:h-[3px] after:w-10 after:rounded-full
            after:bg-gradient-to-r after:from-[#d4af37] after:via-[#f5d56b] after:to-[#b8860b]
          "
        >
          {title}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />

      <div className="min-h-[calc(50vh-10px)] flex items-center justify-center px-2 py-4">
        <div className="w-full max-w-3xl">
          <div className="flex flex-col gap-20">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <Card img={student} title="Students" to="/student" />
              <Card img={papers} title="Paper Report" to="/paper" />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <Card img={teacher} title="Class Report" to="/class" />
              <Card img={subject} title="Result" to="/result" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
