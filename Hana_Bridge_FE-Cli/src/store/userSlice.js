import { createSlice } from '@reduxjs/toolkit';
 
 const initialState = {
  email: 'guest@email.com',
  name: 'guest',
  nickName: 'guest',
  accessToken: 'guest',
  role: 'guest',
  chatMessages: [],
  category: '',
  page: '',
  playFlag: true,
  shouldAutoOpenHelper: false,
  aiPrompts: {
    role: '너는 프로그래밍 강사야.',
    format: '예시 코드를 보여주면서 설명해줘.',
    level: '초등학생도 이해할 수 있도록 설명해줘.',
    }
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
      state.accessToken = 'guest';
      state.role = 'guest';
      state.category = '';
      state.page = '';
      state.playFlag = true;
      state.shouldAutoOpenHelper = false;
      state.aiPrompts = {
        role: '너는 프로그래밍 강사야.',
        format: '예시 코드를 보여주면서 설명해줘.',
        level: '초등학생도 이해할 수 있도록 설명해줘.',
        }
    },
     setAiChat: (state, action) => {
        state.chatMessages = action.payload.chatMessages;
     },
     clearAiChat: (state) =>{
      state.chatMessages = [];
     },
     // 전체 상태 초기화
     resetAll: (state) => {
      Object.assign(state, initialState); 
    },
    setCategory: (state, action) => {
      state.category = action.payload.category;
    },
    setPage: (state, action) =>{
      state.page = action.payload.page;
    },
    setPlayFlag: (state, action) => {
      state.playFlag = action.payload.playFlag;
    },
    setShouldAutoOpenHelper: (state, action) => {
      state.shouldAutoOpenHelper = action.payload.shouldAutoOpenHelper;
    },
    setAiPrompts: (state, action) =>{
      state.aiPrompts = action.payload.aiPrompts;
    },
   },
 });
 
 export const { setUser, modifyUser, clearUser, setAiChat, clearAiChat, setCategory, setPage, 
  setPlayFlag, setShouldAutoOpenHelper, setAiPrompts } = userSlice.actions;
 export default userSlice.reducer;