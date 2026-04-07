import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  createProfileState,
  profileResponse,
  profileState,
} from "./profile.type";
import axios from "axios";

const URL = `${import.meta.env.VITE_API_URL}/api/profile`;

const initialState: profileState = {
  isLoading: false,
  profile: null,
  error: null,
};

export const getProfile = createAsyncThunk<
  profileResponse,
  { userName: string },
  {
    rejectValue: string;
  }
>("/profile/getUserData", async (credential, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${URL}/${credential.userName}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  }

  return rejectWithValue("Unexpected error occured");
});

export const createProfile = createAsyncThunk<
  profileResponse,
  createProfileState,
  { rejectValue: string }
>("/profile/create", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${URL}/create`, credentials, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong",
      );
    }
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // create profile
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error as string;
        state.profile = null;
      });
  },
});

export const {} = profileSlice.actions;
export default profileSlice.reducer;
