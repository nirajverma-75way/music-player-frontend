import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";
import postReducer from "./reducers/postReducer";
import { apiUser } from "../services/user.api";
import { apiPost } from "../services/post.api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiUser.reducerPath]: apiUser.reducer,
    post: postReducer,
    [apiPost.reducerPath]: apiPost.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiUser.middleware).concat(apiPost.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
