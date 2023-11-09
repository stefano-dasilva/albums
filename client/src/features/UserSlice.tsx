import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfoState {
  user_ID: string;
  open_albumDetail: boolean;
  granted_access: boolean;
  open_imageDetail: boolean;
  image_clicked: any;
}

const initialState: UserInfoState = {
  user_ID: "",
  open_albumDetail: false,
  granted_access: false,
  open_imageDetail: false,
  image_clicked: null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserID: (state, action: PayloadAction<string>) => {
      state.user_ID = action.payload;
    },
    
    openAlbumDetail: (state) => {
      state.open_albumDetail = !state.open_albumDetail;
    },
    setGrantedAccess: (state) => {
      state.granted_access = true;
    },
    removeGrantedAccess: (state) => {
      state.granted_access = false;
    },
    setOpenImageDetail: (state) => {
      state.open_imageDetail = true;
    },
    removeOpenImageDetail: (state) => {
      state.open_imageDetail = false;
    },
    setImage_clicked: (state, action: PayloadAction<any>) => {
      state.image_clicked = action.payload;
    },

    createComment: (state, action: PayloadAction<any>) => {
      const { username, text, date } = action.payload;

      state.image_clicked.comments.push({
        text: text,
        date: date,
        creator: {
          username: username,
        },
      });
    },
  },
});

export const {
  setUserID,
  openAlbumDetail,
  createComment,
  setGrantedAccess,
  removeGrantedAccess,
  setOpenImageDetail,
  setImage_clicked,
  removeOpenImageDetail,
} = userSlice.actions;
export default userSlice.reducer;
