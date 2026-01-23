import React, { useMemo } from "react";

const LMSPage = () => {
  // sample data (replace with API later)
  const rows = useMemo(
    () => [
      {
        id: "LMS-001",
        grade: "Grade 6",
        subject: "Maths",
        teacher: "Amila Perera",
        youtubeLink: "https://youtube.com/watch?v=abc123",
        description: "Algebra basics lesson",
        date: "2026-01-23",
        time: "18:30",
      },
      {
        id: "LMS-002",
        grade: "Grade 7",
        subject: "Science",
        teacher: "Kavindi Silva",
        youtubeLink: "https://youtube.com/watch?v=xyz456",
        description: "Plants and photosynthesis",
        date: "2026-01-22",
        time: "20:00",
      },
    ],
    []
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95vw] px-3 sm:px-6 py-4 sm:py-6 min-w-0">
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center">
          LMS
        </h1>

        {/* ADD BUTTON */}
        <div className="mt-4 flex justify-end">
          <button className="rounded-xl bg-green-600 px-4 py-2 text-white font-extrabold hover:bg-green-700 transition">
            + Add LMS
          </button>
        </div>

        {/* TABLE */}
        <div className="mt-4 w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-800 text-sm">
                <th className="p-3 text-left w-[8%]">ID</th>
                <th className="p-3 text-left w-[8%]">Grade</th>
                <th className="p-3 text-left w-[10%]">Subject</th>
                <th className="p-3 text-left w-[12%]">Teacher</th>
                <th className="p-3 text-left w-[16%]">YouTube Link</th>
                <th className="p-3 text-left w-[20%]">Description</th>
                <th className="p-3 text-left w-[10%]">Date</th>
                <th className="p-3 text-left w-[8%]">Time</th>
                <th className="p-3 text-center w-[8%]">Operation</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    No LMS records found
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t text-sm">
                    <td className="p-3 truncate">{r.id}</td>
                    <td className="p-3 truncate">{r.grade}</td>
                    <td className="p-3 truncate">{r.subject}</td>
                    <td className="p-3 truncate">{r.teacher}</td>

                    <td className="p-3 truncate">
                      <a
                        href={r.youtubeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 font-bold hover:underline"
                      >
                        Open Link
                      </a>
                    </td>

                    <td className="p-3 truncate">{r.description}</td>
                    <td className="p-3 truncate">{r.date}</td>
                    <td className="p-3 truncate">{r.time}</td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button className="rounded-lg bg-blue-600 px-3 py-1 text-white text-xs font-bold hover:bg-blue-700">
                          Edit
                        </button>
                        <button className="rounded-lg bg-red-600 px-3 py-1 text-white text-xs font-bold hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LMSPage;
