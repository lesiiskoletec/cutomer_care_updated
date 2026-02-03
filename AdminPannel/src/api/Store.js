// src/api/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "./features/authSlice";
import { authApi } from "./authApi";

import gradeSubjectReducer from "./features/gradeSubjectSlice";
import { gradeSubjectApi } from "./gradeSubjectApi";

import teacherReducer from "./features/teacherSlice";
import { teacherApi } from "./teacherApi";

// ✅ ADD THESE
import { teacherAssignmentApi } from "./teacherAssignmentApi";

import classUiReducer from "./features/classSlice";
import { classApi } from "./classApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gradeSubject: gradeSubjectReducer,
    teacher: teacherReducer,
    classUi: classUiReducer,

    [authApi.reducerPath]: authApi.reducer,
    [gradeSubjectApi.reducerPath]: gradeSubjectApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [classApi.reducerPath]: classApi.reducer,

    // ✅ MUST ADD (this fixes your error)
    [teacherAssignmentApi.reducerPath]: teacherAssignmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      gradeSubjectApi.middleware,
      teacherApi.middleware,
      classApi.middleware,

      // ✅ MUST ADD (this fixes your error)
      teacherAssignmentApi.middleware
    ),
});

setupListeners(store.dispatch);
