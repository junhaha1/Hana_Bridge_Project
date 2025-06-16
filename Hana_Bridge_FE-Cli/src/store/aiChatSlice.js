import { createSlice } from '@reduxjs/toolkit';
/*ai 프롬포트 저장용 리덕스 */

const aiChatInitialState = {
  userPromptList: [],
  //현재 선택한 사용자 프롬포트
  userPrompt: {
    promptId: '',
    name: '',
    role: '',
    form: '',
    level: '',
    option: ''
  }
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState: aiChatInitialState,
  reducers: {
    setUserPromptList: (state, action) => {
      state.userPromptList = action.payload.userPromptList;
    },
    setUserPrompt: (state, action) => {
      state.userPrompt = action.payload.userPrompt;
    },
    clearUserPrompt: (state) => {
        state.userPrompt = {
        promptId: '',
        name: '',
        role: '',
        form: '',
        level: '',
        option: ''
      };
    }
  }
});

export const {setUserPromptList, setUserPrompt, clearUserPrompt} = aiChatSlice.actions;
export default aiChatSlice.reducer