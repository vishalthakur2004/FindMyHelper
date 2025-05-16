import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  accessToken: null,
  status: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { user, accessToken } = action.payload;
      state.userInfo = user;
      state.accessToken = accessToken;
      state.status = true;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearUserInfo: (state) => {
      return initialState;
    },
  },
});

export const { setUserInfo, setAccessToken, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;