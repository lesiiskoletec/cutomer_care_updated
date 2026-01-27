import React, { useMemo, useState } from "react";

const ClassReport = () => {
  // ---- filter state ----
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [reportId, setReportId] = useState("");

  // ---- dropdown options (replace with API later) ----
  const idOptions = ["CR-001", "CR-002", "CR-003"];
  const gradeOptions = ["Grade 06", "Grade 07", "Grade 08", "Grade 09", "Grade 10", "Grade 11"];
  const subjectOptions = ["Maths", "Science", "English", "ICT", "History", "Tamil"];
  const createdByOptions = ["Admin", "Teacher A", "Teacher B"];

  // ---- sample data (replace with API later) ----
  const rows = useMemo(
    () => [
      {
        id: "CR-001",
        grade: "Grade 06",
        subject: "Maths",
        paperCount: 12,
        enrollStudentCount: 120,
        createdBy: "Admin",
        createdDateTime: "2026-01-20 10:15 AM",
      },
      {
        id: "CR-002",
        grade: "Grade 08",
        subject: "Science",
        paperCount: 8,
        enrollStudentCount: 95,
        createdBy: "Teacher A",
        createdDateTime: "2026-01-22 04:40 PM",
      },
      {
        id: "CR-003",
        grade: "Grade 09",
        subject: "ICT",
        paperCount: 5,
        enrollStudentCount: 110,
        createdBy: "Teacher B",
        createdDateTime: "2026-01-23 09:05 AM",
      },
    ],
    []
  );

  // ---- filtering ----
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (reportId && r.id !== reportId) return false;
      if (grade && r.grade !== grade) return false;
      if (subject && r.subject !== subject) return false;
      if (createdBy && r.createdBy !== createdBy) return false;
      return true;
    });
  }, [rows, reportId, grade, subject, createdBy]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setReportId("");
    setGrade("");
    setSubject("");
    setCreatedBy("");
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
          Class Report
        </h1>

        {/* FILTER BOX */}
        <form
          onSubmit={handleSearch}
          className="mt-5 bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Select
                  label="Report ID"
                  value={reportId}
                  onChange={setReportId}
                  options={idOptions}
                  placeholder="Select"
                />
                <Select
                  label="Grade"
                  value={grade}
                  onChange={setGrade}
                  options={gradeOptions}
                  placeholder="Select"
                />
                <Select
                  label="Subject"
                  value={subject}
                  onChange={setSubject}
                  options={subjectOptions}
                  placeholder="Select"
                />
                <Select
                  label="Created By"
                  value={createdBy}
                  onChange={setCreatedBy}
                  options={createdByOptions}
                  placeholder="Select"
                />
              </div>
            </div>

            <div className="w-full lg:w-44 flex lg:flex-col gap-2 lg:justify-start lg:items-stretch">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-4 py-2 text-white font-extrabold hover:bg-blue-800 transition mt-6 lg:mt-6"
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
                <Th className="w-[10%]">ID</Th>
                <Th className="w-[14%]">Grade</Th>
                <Th className="w-[16%]">Subject</Th>
                <Th className="w-[14%]">Paper Count</Th>
                <Th className="w-[18%]">Enroll Student Count</Th>
                <Th className="w-[14%]">Created By</Th>
                <Th className="w-[14%]">Created Date & Time</Th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={7}>
                    No class reports found
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-gray-50">
                    <Td className="truncate font-semibold">{r.id}</Td>
                    <Td className="truncate">{r.grade}</Td>
                    <Td className="truncate">{r.subject}</Td>
                    <Td className="truncate">{r.paperCount}</Td>
                    <Td className="truncate">{r.enrollStudentCount}</Td>
                    <Td className="truncate">{r.createdBy}</Td>
                    <Td className="truncate">{r.createdDateTime}</Td>
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

export default ClassReport;
