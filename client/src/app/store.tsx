import { configureStore } from "@reduxjs/toolkit";
import userSlice, { UserInfoState } from "../features/UserSlice";
import albumSlice, { AlbumState } from "../features/AlbumSlice";



const store = configureStore({
  reducer: {
    userInfo: userSlice,
    album_details: albumSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
