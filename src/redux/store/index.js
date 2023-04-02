import { configureStore } from "@reduxjs/toolkit";
import userAction from "../reducer";

const store = configureStore({
  reducer: {
    userAction: userAction,
  },
});

export default store;
