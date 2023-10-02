import { User } from "@helpers/types/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: null as User | null,
  reducers: {
    addCurrentUser(_, action: PayloadAction<User>) {
      return action.payload;
    },
    removeCurrentUser() {
      return null;
    },
  },
});

export const { addCurrentUser, removeCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
