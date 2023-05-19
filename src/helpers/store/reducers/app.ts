import { combineReducers } from "@reduxjs/toolkit";
import currentUserReducer from "../slices/currentUser";
import isLoggedInReducer from "../slices/isLoggedIn";
import currentBlogReducer from "../slices/currentBlog";

const appReducer = combineReducers({
  isLoggedIn: isLoggedInReducer,
  currentUser: currentUserReducer,
  currentBlog: currentBlogReducer,
});

export default appReducer;
