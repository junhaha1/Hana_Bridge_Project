import { createSlice } from '@reduxjs/toolkit';
 
 const initialState = {
   userId: null,
   name: 'guest',
 };
 
 const userSlice = createSlice({
   name: 'user', // state 이름 (store에서 구분용)
   initialState, // 초기 상태
   reducers: {
     setUser: (state, action) => {
       state.userId = action.payload.userId;
       state.name = action.payload.name;
     },
     clearUser: (state) => {
       state.userId = null;
       state.name = 'guest';
     },
   },
 });
 
 export const { setUser, clearUser } = userSlice.actions;
 export default userSlice.reducer;