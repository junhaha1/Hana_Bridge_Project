import { createSlice } from '@reduxjs/toolkit';
 
 const initialState = {
  email: 'guest@email.com',
  name: 'guest',
  nickName: 'guest',
  role: 'guest',
  chatMessages: [],
  category: '',
  //page: '',
  playFlag: true,
  shouldAutoOpenHelper: false,
  questionCount: 0,
  summaryCount: 0,
  item: 'all',
  aiPrompts: {
    promptId: '',
    name: '',
    role: '',
    form: '',
    level: '',
    option: ''
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
      state.role = action.payload.role;
      state.questionCount = action.payload.questionCount;
      state.summaryCount = action.payload.summaryCount;
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
      //state.page = '';
      state.playFlag = true;
      state.shouldAutoOpenHelper = false;
      state.questionCount = 0;
      state.summaryCount = 0;
      state.item = 'all';
      state.aiPrompts = {
        promptId: '',
        name: '',
        role: '',
        form: '',
        level: '',
        option: ''
        }
    },
    setQuestionCount: (state, action) => {
      state.questionCount = action.payload.questionCount;
    },
    setSummaryCount: (state, action) => {
      state.summaryCount = action.payload.summaryCount;
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
    setPlayFlag: (state, action) => {
      state.playFlag = action.payload.playFlag;
    },
    setShouldAutoOpenHelper: (state, action) => {
      state.shouldAutoOpenHelper = action.payload.shouldAutoOpenHelper;
    },
    setAiPrompts: (state, action) =>{
      state.aiPrompts = action.payload.aiPrompts;
    },
    setItem: (state, action) => {
      state.item = action.payload;
      console.log(state.item);
    },
    clearItem: (state) =>{
      state.item = 'all';
    },
   },
 });
 
 export const { setUser, modifyUser, clearUser, setAiChat, clearAiChat, setCategory, //setPage, 
  setPlayFlag, setShouldAutoOpenHelper, setAiPrompts, setQuestionCount, setSummaryCount, setItem, clearItem } = userSlice.actions;
 export default userSlice.reducer;
