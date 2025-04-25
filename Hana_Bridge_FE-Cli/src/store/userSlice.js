import { createSlice } from '@reduxjs/toolkit';
 
 const initialState = {
   email: null,
   name: 'guest',
   nickName: 'guest@email.com',
   accessToken: null,
 };
 
 const userSlice = createSlice({
   name: 'user', // state 이름 (store에서 구분용)
   initialState, // 초기 상태
   reducers: {
     setUser: (state, action) => {
       state.email = action.payload.email;
       state.name = action.payload.name;
       state.nickName = action.payload.nickName;
       state.accessToken = action.payload.accessToken;
     },
     clearUser: (state) => {
       state.email = null;
       state.name = 'guest';
       state.nickName = 'guest@email.com';
       state.accessToken = null;
     },
   },
 });
 
 export const { setUser, clearUser } = userSlice.actions;
 export default userSlice.reducer;