import { Blog } from "@helpers/types/graphql";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const currentBlogSlice = createSlice({
  name: "currentBlog",
  initialState: null as Blog | null,
  reducers: {
    addCurrentBlog(_, action: PayloadAction<Blog>) {
      return action.payload;
    },
    removeCurrentBlog() {
      return null;
    },
  },
});

export const { addCurrentBlog, removeCurrentBlog } = currentBlogSlice.actions;
export default currentBlogSlice.reducer;
