import { User } from "@helpers/types/user";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  id: "",
  email: "",
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    addCurrentUser(_, action: PayloadAction<User>) {
      return action.payload;
    },
    removeCurrentUser() {
      return initialState;
    },
  },
});

export const { addCurrentUser, removeCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;
