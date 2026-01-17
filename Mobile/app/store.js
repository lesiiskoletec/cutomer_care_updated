// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authslice";
import complaintReducer from "./features/complainSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
   
  },
});

export default store;
