import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AlbumState {
  images: any;
  title?: string;
  album_id ?: any;
  username ? : string;
}

const initialState: AlbumState = {
  images: [],
};

const AlbumSlice = createSlice({
  initialState,
  name: "album_details",
  reducers: {
    setAlbumImages: (state, action: PayloadAction<any>) => {
      state.images = action.payload;
    },
    setAlbumTitle: (state, action: PayloadAction<any>) => {
      state.title = action.payload;
    },
    setAlbum_ID: (state, action: PayloadAction<any>) => {
      state.album_id = action.payload;
    },
    setAlbum_username: (state, action: PayloadAction<any>) => {
      state.username = action.payload;
    },
  },
});

export const { setAlbumImages, setAlbumTitle,setAlbum_ID,setAlbum_username } = AlbumSlice.actions;
export default AlbumSlice.reducer;
