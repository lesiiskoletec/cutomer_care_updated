import React, { useMemo, useState } from "react";

const PaperReport = () => {
  // ---- filter state ----
  const [status, setStatus] = useState("");
  const [paperId, setPaperId] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");

  // ---- dropdown options (replace with API later) ----
  const statusOptions = ["Published", "Draft", "Pending"];
  const paperIdOptions = ["PR-001", "PR-002", "PR-003", "PR-004"];
  const gradeOptions = ["Grade 06", "Grade 07", "Grade 08", "Grade 09", "Grade 10", "Grade 11"];
  const subjectOptions = ["Maths", "Science", "English", "ICT", "History", "Tamil"];

  const districtOptions = ["Colombo", "Gampaha", "Kandy"];
  const townOptions = ["Dehiwala", "Maharagama", "Kiribathgoda", "Peradeniya"];

  // ---- sample table data (replace with API later) ----
  const rows = useMemo(
    () => [
      {
        paperId: "PR-001",
        paperName: "Maths Term 1",
        grade: "Grade 06",
        subject: "Maths",
        district: "Colombo",
        town: "Dehiwala",
        totalStudents: 120,
        submitted: 80,
        avgMarks: 67,
        date: "2026-01-10",
        status: "Published",
      },
      {
        paperId: "PR-002",
        paperName: "Science Unit Test",
        grade: "Grade 08",
        subject: "Science",
        district: "Gampaha",
        town: "Kiribathgoda",
        totalStudents: 95,
        submitted: 40,
        avgMarks: 54,
        date: "2026-01-12",
        status: "Draft",
      },
      {
        paperId: "PR-003",
        paperName: "English Term 1",
        grade: "Grade 07",
        subject: "English",
        district: "Kandy",
        town: "Peradeniya",
        totalStudents: 70,
        submitted: 65,
        avgMarks: 74,
        date: "2026-01-15",
        status: "Published",
      },
      {
        paperId: "PR-004",
        paperName: "ICT Term 1",
        grade: "Grade 09",
        subject: "ICT",
        district: "Colombo",
        town: "Maharagama",
        totalStudents: 110,
        submitted: 0,
        avgMarks: 0,
        date: "2026-01-18",
        status: "Pending",
      },
    ],
    []
  );

  // ---- basic filtering ----
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (paperId && r.paperId !== paperId) return false;
      if (grade && r.grade !== grade) return false;
      if (subject && r.subject !== subject) return false;
      if (district && r.district !== district) return false;
      if (town && r.town !== town) return false;
      return true;
    });
  }, [rows, status, paperId, grade, subject, district, town]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setStatus("");
    setPaperId("");
    setGrade("");
    setSubject("");
    setDistrict("");
    setTown("");
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

  const StatusBadge = ({ value }) => (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-[11px] font-bold ${
        value === "Published"
          ? "bg-green-100 text-green-700"
          : value === "Draft"
          ? "bg-gray-200 text-gray-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {value}
    </span>
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[95vw] px-3 sm:px-6 py-4 sm:py-6 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-800 text-center">
          Paper Report
        </h1>

        {/* FILTER BOX */}
        <form
          onSubmit={handleSearch}
          className="mt-5 bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Status"
                  value={status}
                  onChange={setStatus}
                  options={statusOptions}
                  placeholder="Select"
                />
                <Select
                  label="Paper ID"
                  value={paperId}
                  onChange={setPaperId}
                  options={paperIdOptions}
                  placeholder="Select"
                />
                <Select
                  label="Grade"
                  value={grade}
                  onChange={setGrade}
                  options={gradeOptions}
                  placeholder="Select"
                />
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Subject"
                  value={subject}
                  onChange={setSubject}
                  options={subjectOptions}
                  placeholder="Select"
                />
                <Select
                  label="District"
                  value={district}
                  onChange={setDistrict}
                  options={districtOptions}
                  placeholder="Select"
                />
                <Select
                  label="Town"
                  value={town}
                  onChange={setTown}
                  options={townOptions}
                  placeholder="Select"
                />
              </div>
            </div>

            <div className="w-full lg:w-44 flex lg:flex-col gap-2 lg:justify-start lg:items-stretch">
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-4 py-2 text-white font-extrabold hover:bg-blue-800 transition mt-10"
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
                <Th className="w-[7%]">Paper ID</Th>
                <Th className="w-[14%]">Paper Name</Th>
                <Th className="w-[8%]">Grade</Th>
                <Th className="w-[8%]">Subject</Th>
                <Th className="w-[8%]">District</Th>
                <Th className="w-[8%]">Town</Th>
                <Th className="w-[8%]">Total</Th>
                <Th className="w-[8%]">Submitted</Th>
                <Th className="w-[8%]">Avg Marks</Th>
                <Th className="w-[10%]">Date</Th>
                <Th className="w-[9%]">Status</Th>
                <Th className="w-[12%] text-center">Operation</Th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-gray-500" colSpan={12}>
                    No paper reports found
                  </td>
                </tr>
              ) : (
                filteredRows.map((p) => (
                  <tr key={p.paperId} className="border-t">
                    <Td className="truncate font-semibold">{p.paperId}</Td>
                    <Td className="truncate">{p.paperName}</Td>
                    <Td className="truncate">{p.grade}</Td>
                    <Td className="truncate">{p.subject}</Td>
                    <Td className="truncate">{p.district}</Td>
                    <Td className="truncate">{p.town}</Td>
                    <Td className="truncate">{p.totalStudents}</Td>
                    <Td className="truncate">{p.submitted}</Td>
                    <Td className="truncate">{p.avgMarks}</Td>
                    <Td className="truncate">{p.date}</Td>
                    <Td>
                      <StatusBadge value={p.status} />
                    </Td>

                    <Td className="text-center">
                      <div className="flex justify-center gap-1 flex-wrap">
                        <button className="rounded-lg bg-blue-600 px-2 py-1 text-white text-[11px] font-bold hover:bg-blue-700">
                          View
                        </button>
                        <button className="rounded-lg bg-yellow-500 px-2 py-1 text-white text-[11px] font-bold hover:bg-yellow-600">
                          Edit
                        </button>
                        <button className="rounded-lg bg-red-600 px-2 py-1 text-white text-[11px] font-bold hover:bg-red-700">
                          Delete
                        </button>
                      </div>
                    </Td>
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

export default PaperReport;
