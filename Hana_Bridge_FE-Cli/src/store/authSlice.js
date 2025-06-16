import { createSlice } from '@reduxjs/toolkit';

const authInitialState = {
  accessToken: "guest",
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    clearAccessToken: (state) => {
      state.accessToken = "guest"
    }
  }
});

export const {updateAccessToken, clearAccessToken} = authSlice.actions;
export default authSlice.reducer