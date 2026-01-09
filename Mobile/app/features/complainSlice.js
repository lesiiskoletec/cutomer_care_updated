// app/features/complainSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../api/api";

// Small helper to normalize list items
const normalizeList = (rawList) => {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((item) => ({
    _id: item._id || item.id || item.Id,
    name: item.name || item.Name || item.title || String(item),
  }));
};

// 🔹 Helper: format Date → "YYYY-MM-DD"
const formatYMD = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ✅ MONTH KEY helper: "YYYY-MM"
const getCurrentMonthKey = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

// ──────────────────────────────
// ✅ MONTHLY POINTS
// ──────────────────────────────
export const fetchMonthlyPointsByAgent = createAsyncThunk(
  "complaints/fetchMonthlyPointsByAgent",
  async ({ agentId, monthKey }, { rejectWithValue }) => {
    try {
      if (!agentId) return rejectWithValue("agentId is required");
      const mk = monthKey || getCurrentMonthKey();

      const url = `${API_BASE_URL}/complaints/points/monthly?agentId=${encodeURIComponent(
        agentId
      )}&monthKey=${encodeURIComponent(mk)}`;

      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to load monthly points");
      }

      return {
        monthKey: data.month || mk,
        points: Number(data.points || 0),
        transitions: Number(data.transitions || 0),
        avgMinutes: Number(data.avgMinutes || 0),
      };
    } catch (err) {
      return rejectWithValue("Network error while loading monthly points");
    }
  }
);

// ──────────────────────────────
// DROPDOWNS
// ──────────────────────────────
export const fetchMainProblems = createAsyncThunk(
  "complaints/fetchMainProblems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/mainproblems`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load main problems");

      const raw = Array.isArray(data) ? data : data.mainProblems || [];
      return normalizeList(raw);
    } catch {
      return rejectWithValue("Network error while loading main problems");
    }
  }
);

export const fetchSubProblemsByMain = createAsyncThunk(
  "complaints/fetchSubProblemsByMain",
  async (mainProblemId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/subproblems/by-main/${mainProblemId}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to load sub problems for main problem");
      }

      const raw = Array.isArray(data) ? data : data.subProblems || [];
      return normalizeList(raw);
    } catch {
      return rejectWithValue("Network error while loading sub problems");
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  "complaints/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/departments`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load departments");

      const raw = Array.isArray(data) ? data : data.departments || [];
      return normalizeList(raw);
    } catch {
      return rejectWithValue("Network error while loading departments");
    }
  }
);

export const fetchResponsiblePeopleByDepartment = createAsyncThunk(
  "complaints/fetchResponsiblePeopleByDepartment",
  async (departmentId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/responsiblepeople/by-department/${departmentId}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load responsible people");

      const raw = Array.isArray(data) ? data : data.people || [];
      return normalizeList(raw);
    } catch {
      return rejectWithValue("Network error while loading responsible people");
    }
  }
);

// ──────────────────────────────
// CREATE COMPLAINT
// ──────────────────────────────
export const createComplaint = createAsyncThunk(
  "complaints/createComplaint",
  async (
    {
      CustomerName,
      ContactNumber,
      mainProblem,
      subProblem,
      ResponsibleDepartment,
      responsiblePerson,
      description,
      createdBy,
    },
    { rejectWithValue }
  ) => {
    try {
      const body = {
        CustomerName,
        ContactNumber,
        mainProblem,
        subProblem,
        ResponsibleDepartment,
        responsiblePerson,
        description,
        createdBy,
      };

      const res = await fetch(`${API_BASE_URL}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to create complaint");

      return data.complaint;
    } catch {
      return rejectWithValue("Network error while creating complaint");
    }
  }
);

// ──────────────────────────────
// DAILY REPORT – TODAY BY USER
// ──────────────────────────────
export const fetchTodayComplaintsByUser = createAsyncThunk(
  "complaints/fetchTodayComplaintsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/complaints/today-by-user?userId=${encodeURIComponent(userId)}`
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load today's complaints");

      return data;
    } catch {
      return rejectWithValue("Network error while loading today's complaints");
    }
  }
);

// ──────────────────────────────
// TODAY PENDING BY USER
// ──────────────────────────────
export const fetchTodayPendingComplaintsByUser = createAsyncThunk(
  "complaints/fetchTodayPendingComplaintsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/complaints/getAllTodayComplainStatusByPendingUserId?userId=${encodeURIComponent(
        userId
      )}`;

      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load today's pending complaints");

      const complaints = Array.isArray(data.complaints) ? data.complaints : [];
      return { complaints, count: data.count || complaints.length || 0 };
    } catch {
      return rejectWithValue("Network error while loading today's pending complaints");
    }
  }
);

// ──────────────────────────────
// FILTER (today view)
// ──────────────────────────────
export const fetchComplaintsByFilter = createAsyncThunk(
  "complaints/fetchComplaintsByFilter",
  async (params, { rejectWithValue }) => {
    try {
      const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `${API_BASE_URL}/complaints/filter${query ? `?${query}` : ""}`;

      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load complaints by filter");

      return data;
    } catch {
      return rejectWithValue("Network error while loading filtered complaints");
    }
  }
);

// ──────────────────────────────
// FULL REPORT – ALL COMPLAINTS BY USER
// ──────────────────────────────
export const fetchAllComplaintsByUser = createAsyncThunk(
  "complaints/fetchAllComplaintsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/complaints/getAllReportUserId?userId=${encodeURIComponent(userId)}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load all complaints for user");

      return data;
    } catch {
      return rejectWithValue("Network error while loading all complaints for user");
    }
  }
);

export const fetchComplaintsByFilterFull = createAsyncThunk(
  "complaints/fetchComplaintsByFilterFull",
  async (params, { rejectWithValue }) => {
    try {
      const query = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `${API_BASE_URL}/complaints/filter${query ? `?${query}` : ""}`;

      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load complaints by filter (full report)");

      return data;
    } catch {
      return rejectWithValue("Network error while loading filtered complaints (full report)");
    }
  }
);

// ──────────────────────────────
// USER-WISE COUNTS (DAILY RANGE)
// ──────────────────────────────
export const fetchUserCounts = createAsyncThunk(
  "complaints/fetchUserCounts",
  async (userId, { rejectWithValue }) => {
    try {
      const today = new Date();
      const todayYMD = formatYMD(today);

      const url = `${API_BASE_URL}/complaints/getcomplaintcountstatuswiseByUserId?userId=${encodeURIComponent(
        userId
      )}&fromDate=${todayYMD}&toDate=${todayYMD}`;

      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to load complaint counts for user");

      return data;
    } catch {
      return rejectWithValue("Network error while loading complaint counts for user");
    }
  }
);

// ──────────────────────────────
// ✅ STATUS-ONLY UPDATE BY COMPLAINT ID
// ──────────────────────────────
export const updateComplaintStatus = createAsyncThunk(
  "complaints/updateComplaintStatus",
  async ({ complaintId, status, complaintNote, changedBy }, { rejectWithValue }) => {
    try {
      if (!complaintId) return rejectWithValue("complaintId is required");
      if (!status) return rejectWithValue("status is required");
      if (!changedBy) return rejectWithValue("changedBy (valid userId) is required");

      const url = `${API_BASE_URL}/complaints/updateStatuscomplainById/${encodeURIComponent(
        complaintId
      )}`;

      const body = { status, changedBy };
      if (complaintNote !== undefined) body.complaintNote = complaintNote;

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to update status");

      return data.complaint;
    } catch {
      return rejectWithValue("Network error while updating complaint status");
    }
  }
);

// ──────────────────────────────
// ✅ DELETE COMPLAINT BY ID
// ──────────────────────────────
export const deleteComplaintById = createAsyncThunk(
  "complaints/deleteComplaintById",
  async (complaintId, { rejectWithValue }) => {
    try {
      if (!complaintId) return rejectWithValue("complaintId is required");

      const url = `${API_BASE_URL}/complaints/deletecomplainById/${encodeURIComponent(complaintId)}`;

      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) return rejectWithValue(data.message || "Failed to delete complaint");

      return data.complaint || { _id: complaintId };
    } catch {
      return rejectWithValue("Network error while deleting complaint");
    }
  }
);

// ──────────────────────────────
// SLICE
// ──────────────────────────────
const initialState = {
  mainProblems: [],
  subProblems: [],
  departments: [],
  responsiblePeople: [],
  listStatus: "idle",
  listError: null,

  createStatus: "idle",
  createError: null,

  todayComplaints: [],
  todayStatus: "idle",
  todayError: null,

  todayPendingComplaints: [],
  todayPendingCount: 0,
  todayPendingStatus: "idle",
  todayPendingError: null,

  allComplaints: [],
  allStatus: "idle",
  allError: null,

  userCounts: {
    totalCount: 0,
    pendingCount: 0,
    processingCount: 0,
    solvedCount: 0,
    informedCount: 0,
  },
  userCountsStatus: "idle",
  userCountsError: null,

  monthlyPoints: {
    monthKey: getCurrentMonthKey(),
    points: 0,
    transitions: 0,
    avgMinutes: 0,
  },
  monthlyPointsStatus: "idle",
  monthlyPointsError: null,

  statusUpdateStatus: "idle",
  statusUpdateError: null,

  deleteStatus: "idle",
  deleteError: null,
};

const complaintSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    resetCreateStatus(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    // MONTHLY POINTS
    builder
      .addCase(fetchMonthlyPointsByAgent.pending, (state) => {
        state.monthlyPointsStatus = "loading";
        state.monthlyPointsError = null;
      })
      .addCase(fetchMonthlyPointsByAgent.fulfilled, (state, action) => {
        state.monthlyPointsStatus = "succeeded";
        state.monthlyPoints = action.payload;
        state.monthlyPointsError = null;
      })
      .addCase(fetchMonthlyPointsByAgent.rejected, (state, action) => {
        state.monthlyPointsStatus = "failed";
        state.monthlyPointsError = action.payload || "Failed to load monthly points";
      });

    // DROPDOWNS
    builder
      .addCase(fetchMainProblems.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchMainProblems.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.mainProblems = action.payload;
      })
      .addCase(fetchMainProblems.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load main problems";
      });

    builder
      .addCase(fetchSubProblemsByMain.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchSubProblemsByMain.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.subProblems = action.payload;
      })
      .addCase(fetchSubProblemsByMain.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load sub problems";
      });

    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load departments";
      });

    builder
      .addCase(fetchResponsiblePeopleByDepartment.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchResponsiblePeopleByDepartment.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.responsiblePeople = action.payload;
      })
      .addCase(fetchResponsiblePeopleByDepartment.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load responsible people";
      });

    // CREATE
    builder
      .addCase(createComplaint.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createComplaint.fulfilled, (state) => {
        state.createStatus = "succeeded";
        state.createError = null;
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create complaint";
      });

    // TODAY (ALL)
    builder
      .addCase(fetchTodayComplaintsByUser.pending, (state) => {
        state.todayStatus = "loading";
        state.todayError = null;
      })
      .addCase(fetchTodayComplaintsByUser.fulfilled, (state, action) => {
        state.todayStatus = "succeeded";
        state.todayComplaints = action.payload?.complaints || [];
        state.todayError = null;
      })
      .addCase(fetchTodayComplaintsByUser.rejected, (state, action) => {
        state.todayStatus = "failed";
        state.todayError = action.payload || "Failed to load today's complaints";
        state.todayComplaints = [];
      });

    // TODAY FILTER
    builder
      .addCase(fetchComplaintsByFilter.pending, (state) => {
        state.todayStatus = "loading";
        state.todayError = null;
      })
      .addCase(fetchComplaintsByFilter.fulfilled, (state, action) => {
        state.todayStatus = "succeeded";
        state.todayComplaints = action.payload?.complaints || [];
        state.todayError = null;
      })
      .addCase(fetchComplaintsByFilter.rejected, (state, action) => {
        state.todayStatus = "failed";
        state.todayError = action.payload || "Failed to load filtered complaints";
        state.todayComplaints = [];
      });

    // TODAY PENDING
    builder
      .addCase(fetchTodayPendingComplaintsByUser.pending, (state) => {
        state.todayPendingStatus = "loading";
        state.todayPendingError = null;
      })
      .addCase(fetchTodayPendingComplaintsByUser.fulfilled, (state, action) => {
        state.todayPendingStatus = "succeeded";
        state.todayPendingComplaints = action.payload.complaints || [];
        state.todayPendingCount = action.payload.count || 0;
        state.todayPendingError = null;
      })
      .addCase(fetchTodayPendingComplaintsByUser.rejected, (state, action) => {
        state.todayPendingStatus = "failed";
        state.todayPendingError = action.payload || "Failed to load today's pending complaints";
        state.todayPendingComplaints = [];
        state.todayPendingCount = 0;
      });

    // FULL REPORT
    builder
      .addCase(fetchAllComplaintsByUser.pending, (state) => {
        state.allStatus = "loading";
        state.allError = null;
      })
      .addCase(fetchAllComplaintsByUser.fulfilled, (state, action) => {
        state.allStatus = "succeeded";
        state.allComplaints = action.payload?.complaints || [];
        state.allError = null;
      })
      .addCase(fetchAllComplaintsByUser.rejected, (state, action) => {
        state.allStatus = "failed";
        state.allError = action.payload || "Failed to load all complaints for user";
        state.allComplaints = [];
      });

    builder
      .addCase(fetchComplaintsByFilterFull.pending, (state) => {
        state.allStatus = "loading";
        state.allError = null;
      })
      .addCase(fetchComplaintsByFilterFull.fulfilled, (state, action) => {
        state.allStatus = "succeeded";
        state.allComplaints = action.payload?.complaints || [];
        state.allError = null;
      })
      .addCase(fetchComplaintsByFilterFull.rejected, (state, action) => {
        state.allStatus = "failed";
        state.allError = action.payload || "Failed to load filtered complaints (full report)";
        state.allComplaints = [];
      });

    // USER COUNTS
    builder
      .addCase(fetchUserCounts.pending, (state) => {
        state.userCountsStatus = "loading";
        state.userCountsError = null;
      })
      .addCase(fetchUserCounts.fulfilled, (state, action) => {
        state.userCountsStatus = "succeeded";
        state.userCounts = {
          totalCount: action.payload.total || 0,
          pendingCount: action.payload.pending || 0,
          processingCount: action.payload.processing || 0,
          solvedCount: action.payload.solved || 0,
          informedCount: action.payload.informed || 0,
        };
        state.userCountsError = null;
      })
      .addCase(fetchUserCounts.rejected, (state, action) => {
        state.userCountsStatus = "failed";
        state.userCountsError = action.payload || "Failed to load complaint counts for user";
        state.userCounts = {
          totalCount: 0,
          pendingCount: 0,
          processingCount: 0,
          solvedCount: 0,
          informedCount: 0,
        };
      });

    // ✅ STATUS UPDATE
    builder
      .addCase(updateComplaintStatus.pending, (state) => {
        state.statusUpdateStatus = "loading";
        state.statusUpdateError = null;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.statusUpdateStatus = "succeeded";
        state.statusUpdateError = null;

        const updated = action.payload;
        if (!updated || !updated._id) return;

        const applyUpdate = (list) =>
          list.map((c) => (c._id === updated._id ? { ...c, ...updated } : c));

        state.todayComplaints = applyUpdate(state.todayComplaints);
        state.todayPendingComplaints = applyUpdate(state.todayPendingComplaints);
        state.allComplaints = applyUpdate(state.allComplaints);

        state.todayPendingCount = state.todayPendingComplaints.filter(
          (c) => c.status === "Pending"
        ).length;
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.statusUpdateStatus = "failed";
        state.statusUpdateError = action.payload || "Failed to update complaint status";
      });

    // ✅ DELETE
    builder
      .addCase(deleteComplaintById.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteComplaintById.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteError = null;

        const deleted = action.payload;
        const id = deleted?._id || deleted?.id;
        if (!id) return;

        const removeById = (list) => list.filter((c) => c._id !== id && c.id !== id);

        state.todayComplaints = removeById(state.todayComplaints);
        state.todayPendingComplaints = removeById(state.todayPendingComplaints);
        state.allComplaints = removeById(state.allComplaints);

        state.todayPendingCount = state.todayPendingComplaints.filter(
          (c) => c.status === "Pending"
        ).length;
      })
      .addCase(deleteComplaintById.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload || "Failed to delete complaint";
      });
  },
});

export const { resetCreateStatus } = complaintSlice.actions;
export default complaintSlice.reducer;
