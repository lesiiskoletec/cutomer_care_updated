import React, { useMemo } from "react";

const GradeSubjectPage = () => {
  // sample data (replace with API later)
  const rows = useMemo(
    () => [
      { id: "GS-001", grade: "Grade 6", subject: "Maths" },
      { id: "GS-002", grade: "Grade 7", subject: "Science" },
      { id: "GS-003", grade: "Grade 9", subject: "English" },
    ],
    []
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95vw] px-3 sm:px-6 py-4 sm:py-6 min-w-0">
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center">
          Grade & Subjects
        </h1>

        {/* ADD BUTTON */}
        <div className="mt-4 flex justify-end">
          <button className="rounded-xl bg-green-600 px-4 py-2 text-white font-extrabold hover:bg-green-700 transition">
            + Add Grade & Subject
          </button>
        </div>

        {/* TABLE */}
        <div className="mt-4 w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-800 text-sm">
                <th className="p-3 text-left w-[15%]">ID</th>
                <th className="p-3 text-left w-[30%]">Grade</th>
                <th className="p-3 text-left w-[35%]">Subject</th>
                <th className="p-3 text-center w-[20%]">Operation</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No grade/subject records found
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t text-sm">
                    <td className="p-3 truncate">{r.id}</td>
                    <td className="p-3 font-semibold truncate">{r.grade}</td>
                    <td className="p-3 truncate">{r.subject}</td>

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

export default GradeSubjectPage;
