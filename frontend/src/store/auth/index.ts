import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthResponse, AuthState } from "./auth.types";

const URL = `${import.meta.env.VITE_API_URL}/api/auth`;

//*initial state
const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null,
  message: null,
};

//* register user
export const registerUser = createAsyncThunk<
  AuthResponse,
  {
    email: string;
    password: string;
    confirmPassword: string;
  },
  { rejectValue: string }
>("/auth/registerUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL}/register`, credentials, {
      withCredentials: true, //import if using cookies
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "something went wrong",
      );
    }

    return rejectWithValue("Unexpected Error Occured");
  }
});

//*login user
export const loginUser = createAsyncThunk<
  AuthResponse,
  {
    email: string;
    password: string;
  },
  { rejectValue: string }
>("/auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL}/login`, credentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "something weng wrong",
      );
    }
  }

  return rejectWithValue("Unexpected error Occured");
});

export const authCheck = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("/auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL}/check-auth`, {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store , no-cache ,must-revalidate ,proxy-revalidate",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "something weng wrong",
      );
    }
  }

  return rejectWithValue("Unexpected error Occured");
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "/auth/logout",
  async (_NEVER, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}/logout`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "something went wrong",
        );
      }
    }

    return rejectWithValue("unexpected error occured");
  },
);

export const forgetPassword = createAsyncThunk<
  {
    message: string;
  },
  {
    email: string;
  },
  { rejectValue: string }
>("/auth/forget-pwd", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL}/forget-password`, credentials);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "something went wrong",
      );
    }
  }

  return rejectWithValue("Unexpected error occured");
});

export const resetPassword = createAsyncThunk<
  { message: string },
  {
    password: string;
    token: string;
  },
  {
    rejectValue: string;
  }
>("/auth/reset-pwd", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL}/reset-password`, credentials);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "something went wrong",
      );
    }
  }

  return rejectWithValue("Unexpected error occured");
});
//slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetToken: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.isLoading = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //* register
      //pending
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      //fulfilled
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      //rejected
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //* login
      //pending
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // fulfilled
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload.user;
      })
      //rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = (action.payload as string) ?? "login failed";
      })
      //* check auth
      //pending
      .addCase(authCheck.pending, (state) => {
        state.isLoading = true;
      })
      //fulfilled
      .addCase(authCheck.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      //rejected
      .addCase(authCheck.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      //* logout fulfilled
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      //*forgot pws
      //pending
      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
      }) //fulfilled
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message as string;
      }) //rejected
      .addCase(forgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //*reset pws
      //pending
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      }) //fulfilled
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.message = action.payload.message;
      }) //rejected
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetToken } = authSlice.actions;
export default authSlice.reducer;
