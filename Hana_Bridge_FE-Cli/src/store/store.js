import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';
import aiChatReducer from './aiChatSlice';
import postReducer from './postSlice'

// userSlice의 기본 상태 정의
const defaultUserState = {
  email: 'guest@email.com',
  name: 'guest',
  nickName: 'guest',
  role: 'guest',
  chatMessages: [],
  category: '',
  playFlag: true,
  shouldAutoOpenHelper: false,
  questionCount: 0,
  summaryCount: 0,
  aiPrompts: {
    promptId: '',
    name: '',
    role: '',
    form: '',
    level: '',
    option: ''
  }
};

// localStorage에서 불러오기
// 불러올 때 1시간 지나면 삭제
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('userState');
    if (serializedState === null) {
      return undefined;
    }

    const parsed = JSON.parse(serializedState);
    const now = new Date().getTime();
    const EXPIRATION_TIME = 60 * 60 * 1000; // 1시간

    if (parsed.savedAt && now - parsed.savedAt > EXPIRATION_TIME) {
      localStorage.clear(); // 모든 localStorage 삭제
      console.log("⏰ 1시간 경과: localStorage 초기화됨");
      return undefined;
    }

    return {
      user: {
        ...defaultUserState,
        ...parsed,
        aiPrompts: {
          ...defaultUserState.aiPrompts,
          ...parsed.aiPrompts
        }
      }
    };
  } catch (err) {
    console.error("불러오기 실패", err);
    return undefined;
  }
};

// localStorage에 저장하기
const saveState = (state) => {
  try {
    const { chatMessages, aiPrompts, category, nickName } = state.user;
    const serializedState = JSON.stringify({
      chatMessages,
      aiPrompts,
      category,
      nickName,
      savedAt: new Date().getTime() // 저장 시간 추가
    });
    localStorage.setItem('userState', serializedState);
  } catch (err) {
    console.error("저장 실패", err);
  }
};


// Redux store 생성
const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    aiChat: aiChatReducer,
    post: postReducer,
  },
  preloadedState: loadState(), // 초기 상태에 localStorage 값 사용
});

// 이전 상태 저장용 변수
let previousState = {
  chatMessages: [],
  aiPrompts: {
    promptId: '',
    name: '',
    role: '',
    form: '',
    level: '',
    option: ''
  },
  category: '',
  nickName: 'guest'
};

// 상태 변경 감지해서 일부만 저장
store.subscribe(() => {
  const current = store.getState().user;

  const hasChanged =
    JSON.stringify(previousState.chatMessages) !== JSON.stringify(current.chatMessages) ||
    JSON.stringify(previousState.aiPrompts) !== JSON.stringify(current.aiPrompts) ||
    previousState.category !== current.category ||
    previousState.nickName !== current.nickName;

  if (hasChanged) {
    previousState = {
      chatMessages: current.chatMessages,
      aiPrompts: current.aiPrompts,
      category: current.category,
      nickName: current.nickName
    };

    saveState({ user: previousState });
  }
});

export default store;