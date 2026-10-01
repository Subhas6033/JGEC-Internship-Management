import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user state
    setUser(state, action) {
      state.user = action.payload;
      state.status = "succeeded";
    },

    // Set access token
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    // Set refresh token
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
      localStorage.setItem("refreshToken", action.payload);
    },

    // Update user info
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },

    // Logout action
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },

    // Set loading status
    setLoading(state, action) {
      state.status = action.payload;
    },

    // Set error
    setError(state, action) {
      state.error = action.payload;
      state.status = "failed";
    },

    // Clear error
    clearError(state) {
      state.error = null;
    },
  },
  // Handle hydration from localStorage on app start
  extraReducers: (builder) => {
    builder.addCase("HYDRATE", (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    });
  },
});

// Export actions
export const {
  setUser,
  setAccessToken,
  setRefreshToken,
  updateUser,
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectStatus = (state) => state.auth.status;
export const selectError = (state) => state.auth.error;

// Thunk for automatic login from stored tokens
export const autoLogin = () => (dispatch, getState) => {
  const token = getState().auth.accessToken;
  if (token) {
    // Token exists, user is potentially logged in
    // The actual profile should be fetched when needed
    dispatch(setUser({ isAutoloaded: true }));
  }
};
