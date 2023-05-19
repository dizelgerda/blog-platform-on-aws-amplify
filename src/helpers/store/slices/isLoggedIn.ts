import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const isLoggedInSlice = createSlice({
  name: "isLoggedIn",
  initialState: false,
  reducers: {
    changeStatus(state, action: PayloadAction<boolean>) {
      return action.payload;
    },
  },
});

export const { changeStatus } = isLoggedInSlice.actions;
export default isLoggedInSlice.reducer;
