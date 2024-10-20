import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEveryUserDetails = createAsyncThunk(
  "admin/fetchEveryDetails",
  async () => {
    const response = await axios.get("http://localhost:3000/api/admin/userDetails", {
      withCredentials: true,
    });
    return response.data;
  }
);

const initialState = {
  users: [],
  loading: null,
  error: null,
};

const everyUserSlice = createSlice({
  name: "everyUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEveryUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEveryUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchEveryUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectUsers = (state) => state.everyUser.users;
export const selectLoading = (state) => state.everyUser.loading;
export const selectError = (state) => state.everyUser.error;

export default everyUserSlice.reducer;
