import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

//localStorage에서 불러오기
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('userState');
    if (serializedState === null) {
      return undefined;
    }
    return { user: JSON.parse(serializedState) };  // 슬라이스 이름에 맞게
  } catch (err) {
    console.error("불러오기 실패", err);
    return undefined;
  }
};

//localStorage에 저장하기
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.user);  // user slice만 저장
    localStorage.setItem('userState', serializedState);
  } catch (err) {
    console.error("저장 실패", err);
  }
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: loadState(), // 초기 상태에 localStorage 값 사용
});

// 상태가 바뀔 때마다 localStorage에 저장
store.subscribe(() => {
  saveState(store.getState());
});


export default store;
