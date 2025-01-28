import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";
import songReducer from "./reducers/songReducer";
import playlistReducer from "./reducers/playlistReducer";
import { apiUser } from "../services/user.api";
import { apiSong } from "../services/song.api";
import { apiPlaylist } from "../services/playlist.api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiUser.reducerPath]: apiUser.reducer,
    song: songReducer,
    [apiSong.reducerPath]: apiSong.reducer,
    playlist: playlistReducer,
    [apiPlaylist.reducerPath]: apiPlaylist.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiUser.middleware).concat(apiSong.middleware).concat(apiPlaylist.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
