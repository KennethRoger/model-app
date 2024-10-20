import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import everUserReducer from "../features/everyUserSlice"

const store = configureStore({
  reducer:{
    user: userReducer,
    everyUser: everUserReducer
  },
});

export default store;
