import { Alert } from "@helpers/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: null as Alert | null,
  reducers: {
    setAlert(state: unknown, action: PayloadAction<Alert>): Alert {
      return action.payload;
    },
    removeAlert() {
      return null;
    },
  },
});

export const { setAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
