import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "userData",
  initialState: {
    userName: "",
    email: "",
    section: "",
    product: "",
    position: "",
    photo: "",
    searchValue: "",
  },
  reducers: {
    loginUser: (state, action) => {
      state.userName = action.payload.payload[0].username;
      state.position = action.payload.payload[0].position;
      state.section = action.payload.payload[0].section;
      state.product = action.payload.payload[0].product;
      state.photo = action.payload.payload[0].photo;
    },
    searchValue: (state, action) => {
      return { ...state, searchValue: action.payload.payload };
    },
  },
});

export const { loginUser, searchValue } = user.actions;
export default user.reducer;
