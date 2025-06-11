// src/store/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPostLoading: false,
  isPostComplete: false,
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
    }
  }
});

export const { setPostLoading, setPostComplete, resetPostState } = postSlice.actions;
export default postSlice.reducer;
