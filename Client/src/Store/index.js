import { configureStore } from "@reduxjs/toolkit";
import { studentApi } from "./Api/studentApi";
import authReducer from "./Slice/authSlice";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // Auth slice
    auth: authReducer,

    // RTK Query API slice
    [studentApi.reducerPath]: studentApi.reducer,
  },

  // Add middleware for RTK Query and devtools
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(studentApi.middleware),

  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
});

// Export types for TypeScript (commented out for JS projects)
// Uncomment if using TypeScript
/*
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
*/
