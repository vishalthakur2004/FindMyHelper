import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  status: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.status = true;
    },
    clearUserInfo: (state) => {
      return initialState;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;