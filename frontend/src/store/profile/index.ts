import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { profileResponse, profileState } from "./profile.type";
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const {} = profileSlice.actions;
export default profileSlice.reducer;
