// src/store/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPostLoading: false,
  isPostComplete: false,
  curPage: 1,
  curPageGroup: 0,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostLoading: (state, action) => {
      state.isPostLoading = action.payload;
    },
    setPostComplete: (state, action) => {
      state.isPostComplete = action.payload;
    },
    resetPostState: (state) => {
      state.isPostLoading = false;
      state.isPostComplete = false;
    },
    setCurPage: (state, action) => {
      console.log("slice: " + action.payload)
      state.curPage = action.payload;
    },
    setCurPageGroup: (state, action) => {
      state.curPageGroup = action.payload;
    },
    resetPage: (state) => {
      state.curPage = 1;
      state.curPageGroup = 0;
    }
  }
});

export const { setPostLoading, setPostComplete, resetPostState, setCurPage, setCurPageGroup, resetPage } = postSlice.actions;
export default postSlice.reducer;
