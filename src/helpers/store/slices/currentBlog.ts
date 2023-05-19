import { Blog } from "@helpers/types/graphql";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const currentBlogSlice = createSlice({
  name: "currentBlog",
  initialState: {},
  reducers: {
    addCurrentBlog(_, action: PayloadAction<Blog>) {
      return action.payload;
    },
    removeCurrentBlog() {
      return {};
    },
  },
});

export const { addCurrentBlog, removeCurrentBlog } = currentBlogSlice.actions;
export default currentBlogSlice.reducer;
