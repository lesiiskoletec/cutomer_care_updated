// app/features/authslice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "lesicc_logged_user";

// 🔹 Small helper to normalize user object
const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const mongoId = rawUser._id || rawUser.id;
  return {
    ...rawUser,
    _id: mongoId, // ✅ ALWAYS keep _id for frontend usage
  };
};

// 🔹 REGISTER (SignUp)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, gender, phonenumber, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, gender, phonenumber, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log("SignUp error response:", data);
        return rejectWithValue(data.message || "Registration failed");
      }

      const normalized = normalizeUser(data.user);

      return {
        user: normalized,
        phonenumber,
      };
    } catch (err) {
      console.log("SignUp network error:", err);
      return rejectWithValue("Network error during registration");
    }
  }
);

// 🔹 VERIFY OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ phonenumber, code }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/whatsapp/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phonenumber, code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log("Verify OTP error response:", data);
        return rejectWithValue(data.message || "Verification failed");
      }

      const normalized = normalizeUser(data.user);

      // backend returns { user: {...} }
      return normalized;
    } catch (err) {
      console.log("Verify OTP network error:", err);
      return rejectWithValue("Network error during verification");
    }
  }
);

// 🔹 LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phonenumber: phone, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.log("Login error response:", data);
        return rejectWithValue(data.message || "Login failed");
      }

      const normalized = normalizeUser(data.user);

      return normalized;
    } catch (err) {
      console.log("Login network error:", err);
      return rejectWithValue("Network error during login");
    }
  }
);

// 🔹 LOAD USER FROM STORAGE
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // In case old data had only "id"
      return normalizeUser(parsed);
    } catch (err) {
      console.log("loadUserFromStorage error:", err);
      return rejectWithValue("Failed to load stored user");
    }
  }
);

const initialState = {
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pendingPhone: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.pendingPhone = null;

      AsyncStorage.removeItem(USER_KEY).catch((err) =>
        console.log("AsyncStorage remove error:", err)
      );
    },
    setPendingPhone(state, action) {
      state.pendingPhone = action.payload;
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user || null;
        state.pendingPhone = action.payload.phonenumber;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });

    // VERIFY OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.pendingPhone = null;
        state.error = null;

        AsyncStorage.setItem(USER_KEY, JSON.stringify(action.payload)).catch(
          (err) => console.log("AsyncStorage set error (verify):", err)
        );
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Verification failed";
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;

        AsyncStorage.setItem(USER_KEY, JSON.stringify(action.payload)).catch(
          (err) => console.log("AsyncStorage set error (login):", err)
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      });

    // LOAD USER FROM STORAGE
    builder
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.status = "succeeded";
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        console.log("loadUserFromStorage rejected:", action.payload);
      });
  },
});

export const { logout, setPendingPhone } = authSlice.actions;
export default authSlice.reducer;
