import { createSlice } from '@reduxjs/toolkit';

const authInitialState = {
  accessToken: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
  }
});

export const {updateAccessToken} = authSlice.actions;
export default authSlice.reducer