import { createSlice } from '@reduxjs/toolkit';
 
 const initialState = {
   email: 'guest@email.com',
   name: 'guest',
   nickName: 'guest',
   accessToken: 'guest',
   role: 'guest',
   chatMessages: [],
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
     modifyUser: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.nickName = action.payload.nickName;
    },
     clearUser: (state) => {
       state.email = 'guest@email.com';
       state.name = 'guest';
       state.nickName = 'guest';
       state.accessToken = null;
       state.role = null;
     },
     setAiChat: (state, action) => {
        state.chatMessages = action.payload.chatMessages;
        console.log(state.chatMessages);
     },
     clearAiChat: (state) =>{
      state.chatMessages = [];
     },
     // 전체 상태 초기화
     resetAll: (state) => {
      Object.assign(state, initialState); 
    }    
   },
 });
 
 export const { setUser, modifyUser, clearUser, setAiChat, clearAiChat } = userSlice.actions;
 export default userSlice.reducer;