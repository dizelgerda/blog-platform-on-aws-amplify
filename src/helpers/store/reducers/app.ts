import { combineReducers } from "@reduxjs/toolkit";
import currentUserReducer from "../slices/currentUser";
import isLoggedInReducer from "../slices/isLoggedIn";
import currentBlogReducer from "../slices/currentBlog";
import alertReducer from "../slices/alert";

const appReducer = combineReducers({
  isLoggedIn: isLoggedInReducer,
  alert: alertReducer,
  currentUser: currentUserReducer,
  currentBlog: currentBlogReducer,
});

export default appReducer;
