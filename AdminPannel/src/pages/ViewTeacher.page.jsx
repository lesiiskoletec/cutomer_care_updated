import React, { useMemo } from "react";

const ViewTeacherPage = () => {
  // sample data (replace with API later)
  const teachers = useMemo(
    () => [
      {
        id: "T-001",
        name: "Amila Perera",
        email: "amila@mail.com",
        whatsapp: "94771234567",
        password: "********",
      },
      {
        id: "T-002",
        name: "Kavindi Silva",
        email: "kavindi@mail.com",
        whatsapp: "94774567890",
        password: "********",
      },
    ],
    []
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95vw] px-3 sm:px-6 py-4 sm:py-6 min-w-0">
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center">
          Teachers
        </h1>

        {/* ADD BUTTON */}
        <div className="mt-4 flex justify-end">
          <button className="rounded-xl bg-green-600 px-4 py-2 text-white font-extrabold hover:bg-green-700 transition">
            + Add Teacher
          </button>
        </div>

        {/* TABLE */}
        <div className="mt-4 w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-800 text-sm">
                <th className="p-3 text-left w-[8%]">ID</th>
                <th className="p-3 text-left w-[18%]">Teacher Name</th>
                <th className="p-3 text-left w-[22%]">Email</th>
                <th className="p-3 text-left w-[16%]">WhatsApp</th>
                <th className="p-3 text-left w-[12%]">Password</th>
                <th className="p-3 text-left w-[12%]">View Grade & Subjects</th>
                <th className="p-3 text-center w-[12%]">Operation</th>
              </tr>
            </thead>

            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No teachers found
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="border-t text-sm">
                    <td className="p-3 truncate">{t.id}</td>
                    <td className="p-3 font-semibold truncate">{t.name}</td>
                    <td className="p-3 truncate">{t.email}</td>
                    <td className="p-3 truncate">{t.whatsapp}</td>
                    <td className="p-3 truncate">{t.password}</td>

                    <td className="p-3">
                      <button className="rounded-lg bg-indigo-600 px-3 py-1 text-white text-xs font-bold hover:bg-indigo-700">
                        View
                      </button>
                    </td>

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

export default ViewTeacherPage;
