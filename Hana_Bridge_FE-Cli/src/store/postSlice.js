// src/store/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPostLoading: false,
  isPostComplete: false,
  curCodePage: 1,
  curNoticePage: 1,
  curAssemblePage: 1,
  curMyPage: 1,
  isOpenLeftHeader: true,
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
      const payload = action.payload;

      if (payload.curCodePage !== undefined) {
        state.curCodePage = payload.curCodePage;
      }
      if (payload.curNoticePage !== undefined) {
        state.curNoticePage = payload.curNoticePage;
      }
      if (payload.curAssemblePage !== undefined) {
        state.curAssemblePage = payload.curAssemblePage;
      }
      if (payload.curMyPage !== undefined) {
        state.curMyPage = payload.curMyPage;
      }
    },
    resetPage: (state, action) => {
      const category = action.payload;

      if (category === 'code') {
        state.curCodePage = 1;
      } else if (category === 'notice') {
        state.curNoticePage = 1;
      } else if (category === 'assemble') {
        state.curAssemblePage = 1;
      } else if (category === 'my') {
        state.curMyPage = 1;
      }
    },
    setIsOpenLeftHeader: (state, action) => {
      state.isOpenLeftHeader = action.payload;
    },
  }
});

export const { setPostLoading, setPostComplete, resetPostState, setCurPage, setCurPageGroup, resetPage, setIsOpenLeftHeader } = postSlice.actions;
export default postSlice.reducer;
