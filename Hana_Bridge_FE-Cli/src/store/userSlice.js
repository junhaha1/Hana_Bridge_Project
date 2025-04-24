import { createSlice } from '@reduxjs/toolkit';
 
 const initialState = {
   userId: null,
   nickName: 'guest',
   accessToken: null,
 };
 
 const userSlice = createSlice({
   name: 'user', // state 이름 (store에서 구분용)
   initialState, // 초기 상태
   reducers: {
     setUser: (state, action) => {
       state.userId = action.payload.userId;
       state.nickName = action.payload.nickName;
       state.accessToken = action.payload.accessToken;
     },
     clearUser: (state) => {
       state.userId = null;
       state.nickName = 'guest';
       state.accessToken = null;
     },
   },
 });
 
 export const { setUser, clearUser } = userSlice.actions;
 export default userSlice.reducer;