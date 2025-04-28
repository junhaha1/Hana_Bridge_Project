import { createSlice } from '@reduxjs/toolkit';
 
 const initialState = {
   email: 'guest@email.com',
   name: 'guest',
   nickName: 'guest',
   accessToken: 'guest',
   role: 'guest',
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
       state.role = action.payload.role;
     },
     clearUser: (state) => {
       state.email = 'guest@email.com';
       state.name = 'guest';
       state.nickName = 'guest';
       state.accessToken = null;
       state.role = null;
     },
   },
 });
 
 export const { setUser, clearUser } = userSlice.actions;
 export default userSlice.reducer;