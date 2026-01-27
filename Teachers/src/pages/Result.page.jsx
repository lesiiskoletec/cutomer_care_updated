import React, { useMemo, useState } from "react";

const Result = () => {
  // ---- filter state ----
  const [paperName, setPaperName] = useState("");

  // ---- dropdown options (replace with API later) ----
  const paperOptions = ["Maths Term 1", "Science Unit Test", "English Term 1", "ICT Term 1"];

  // ---- sample table data (replace with API later) ----
  const rows = useMemo(
    () => [
      { id: "R-001", studentName: "Nimal Perera", grade: "Grade 06", subject: "Maths", exam: "Maths Term 1" },
      { id: "R-002", studentName: "Kavindi Silva", grade: "Grade 08", subject: "Science", exam: "Science Unit Test" },
      { id: "R-003", studentName: "Sahan Jayasooriya", grade: "Grade 07", subject: "English", exam: "English Term 1" },
      { id: "R-004", studentName: "Ishara Fernando", grade: "Grade 09", subject: "ICT", exam: "ICT Term 1" },
    ],
    []
  );

  // ---- filtering ----
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (paperName && r.exam !== paperName) return false;
      return true;
    });
  }, [rows, paperName]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setPaperName("");
  };

  const Select = ({ label, value, onChange, options, placeholder }) => (
    <div className="w-full">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">{placeholder}</option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );

  const Th = ({ children, className = "" }) => (
    <th className={`p-2 text-left text-[12px] font-bold text-gray-800 ${className}`}>
      {children}
    </th>
  );

  const Td = ({ children, className = "" }) => (
    <td className={`p-2 align-top text-[12px] text-gray-700 ${className}`}>
      {children}
    </td>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95vw] px-3 sm:px-6 py-4 sm:py-6 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center">
          Result
        </h1>

        {/* FILTER BOX (ONLY PAPER NAME + BUTTONS) */}
        <form
          onSubmit={handleSearch}
          className="mt-5 bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Paper Name"
                  value={paperName}
                  onChange={setPaperName}
                  options={paperOptions}
                  placeholder="Select Paper"
                />
              </div>
            </div>

            <div className="w-full lg:w-44 flex lg:flex-col gap-2 lg:justify-start lg:items-stretch">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-4 py-2 text-white font-extrabold hover:bg-blue-800 transition mt-6"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full rounded-xl bg-gray-200 px-4 py-2 text-gray-800 font-extrabold hover:bg-red-300 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {/* TABLE */}
        <div className="mt-4 w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <Th className="w-[12%]">ID</Th>
                <Th className="w-[28%]">Student Name</Th>
                <Th className="w-[15%]">Grade</Th>
                <Th className="w-[15%]">Subject</Th>
                <Th className="w-[30%]">Exam</Th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={5}>
                    No results found
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <Td className="truncate font-semibold">{r.id}</Td>
                    <Td className="truncate">{r.studentName}</Td>
                    <Td className="truncate">{r.grade}</Td>
                    <Td className="truncate">{r.subject}</Td>
                    <Td className="truncate">{r.exam}</Td>
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

export default Result;
