import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  status: "idle",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAuth: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken || null;
      state.isAuthenticated = true;
      state.status = "authenticated";
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "authenticated";
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    setAuthLoading: (state) => {
      state.status = "loading";
    },

    setAuthError: (state) => {
      state.status = "error";
      state.isAuthenticated = false;
    },

    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = "idle";
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.status = "idle";
    },
  },
});

export const {
  setAuth,
  setUser,
  setAccessToken,
  setAuthLoading,
  setAuthError,
  clearUser,
  logout,
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectStatus = (state) => state.auth.status;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export default authSlice.reducer;
