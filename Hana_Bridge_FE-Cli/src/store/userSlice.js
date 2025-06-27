import { createSlice } from '@reduxjs/toolkit';

// localStorage에서 사용자 정보를 가져오는 함수
const loadUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    console.log('localStorage에서 불러온 데이터:', userData);
    if (userData) {
      const parsedData = JSON.parse(userData);
      console.log('파싱된 사용자 데이터:', parsedData);
      return parsedData;
    }
  } catch (error) {
    console.error('localStorage에서 사용자 데이터를 불러오는데 실패했습니다:', error);
  }
  return null;
};

// localStorage에 사용자 정보를 저장하는 함수
const saveUserToStorage = (userData) => {
  try {
    console.log('localStorage에 저장할 데이터:', userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('localStorage 저장 완료');
  } catch (error) {
    console.error('localStorage에 사용자 데이터를 저장하는데 실패했습니다:', error);
  }
};

// localStorage에서 사용자 정보를 삭제하는 함수
const removeUserFromStorage = () => {
  try {
    localStorage.removeItem('userData');
  } catch (error) {
    console.error('localStorage에서 사용자 데이터를 삭제하는데 실패했습니다:', error);
  }
};

// 초기 상태를 localStorage에서 가져오거나 기본값 사용
const storedUser = loadUserFromStorage();
 
 const initialState = {
  email: storedUser?.email || 'guest@email.com',
  name: storedUser?.name || 'guest',
  nickName: storedUser?.nickName || 'guest',
  role: storedUser?.role || 'guest',
  chatMessages: [],
  category: '',
  //page: '',
  playFlag: true,
  shouldAutoOpenHelper: false,
  questionCount: storedUser?.questionCount || 0,
  summaryCount: storedUser?.summaryCount || 0,
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
      
      // localStorage에 저장
      saveUserToStorage({
        email: action.payload.email,
        name: action.payload.name,
        nickName: action.payload.nickName,
        role: action.payload.role,
        questionCount: action.payload.questionCount,
        summaryCount: action.payload.summaryCount
      });
    },
    modifyUser: (state, action) => {
    state.email = action.payload.email;
    state.name = action.payload.name;
    state.nickName = action.payload.nickName;
    
    // localStorage 업데이트
    const currentUser = loadUserFromStorage() || {};
    saveUserToStorage({
      ...currentUser,
      email: action.payload.email,
      name: action.payload.name,
      nickName: action.payload.nickName
    });
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
      
      // localStorage에서 삭제
      removeUserFromStorage();
    },
    setQuestionCount: (state, action) => {
      state.questionCount = action.payload.questionCount;
      
      // localStorage 업데이트
      const currentUser = loadUserFromStorage() || {};
      saveUserToStorage({
        ...currentUser,
        questionCount: action.payload.questionCount
      });
    },
    setSummaryCount: (state, action) => {
      state.summaryCount = action.payload.summaryCount;
      
      // localStorage 업데이트
      const currentUser = loadUserFromStorage() || {};
      saveUserToStorage({
        ...currentUser,
        summaryCount: action.payload.summaryCount
      });
    },
    setAiChat: (state, action) => {
      state.chatMessages = action.payload.chatMessages;
    },
    clearAiChat: (state) =>{
    state.chatMessages = [];
    },
    // 전체 상태 초기화
    resetAll: (state) => {
      // localStorage에서 최신 사용자 정보를 다시 불러와서 상태 초기화
      const storedUser = loadUserFromStorage();
      if (storedUser) {
        state.email = storedUser.email || 'guest@email.com';
        state.name = storedUser.name || 'guest';
        state.nickName = storedUser.nickName || 'guest';
        state.role = storedUser.role || 'guest';
        state.questionCount = storedUser.questionCount || 0;
        state.summaryCount = storedUser.summaryCount || 0;
      } else {
        // localStorage에 데이터가 없으면 기본값으로 초기화
        state.email = 'guest@email.com';
        state.name = 'guest';
        state.nickName = 'guest';
        state.role = 'guest';
        state.questionCount = 0;
        state.summaryCount = 0;
      }
      
      // 다른 상태들은 기본값으로 초기화
      state.chatMessages = [];
      state.category = '';
      state.playFlag = true;
      state.shouldAutoOpenHelper = false;
      state.item = 'all';
      state.aiPrompts = {
        promptId: '',
        name: '',
        role: '',
        form: '',
        level: '',
        option: ''
      };
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
    // localStorage에서 사용자 정보를 다시 불러오는 액션
    reloadUserFromStorage: (state) => {
      console.log('reloadUserFromStorage 액션 실행');
      const storedUser = loadUserFromStorage();
      if (storedUser) {
        console.log('localStorage에서 사용자 정보 복원:', storedUser);
        state.email = storedUser.email || 'guest@email.com';
        state.name = storedUser.name || 'guest';
        state.nickName = storedUser.nickName || 'guest';
        state.role = storedUser.role || 'guest';
        state.questionCount = storedUser.questionCount || 0;
        state.summaryCount = storedUser.summaryCount || 0;
        console.log('복원된 role:', state.role);
      } else {
        console.log('localStorage에 사용자 데이터가 없음');
      }
    },
   },
 });
 
 export const { setUser, modifyUser, clearUser, setAiChat, clearAiChat, setCategory, //setPage, 
  setPlayFlag, setShouldAutoOpenHelper, setAiPrompts, setQuestionCount, setSummaryCount, setItem, clearItem, reloadUserFromStorage } = userSlice.actions;
 export default userSlice.reducer;
