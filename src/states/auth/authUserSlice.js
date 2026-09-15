import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login as loginApi,
  register as registerApi,
  getOwnProfile,
  putAccessToken,
  getAccessToken,
  removeAccessToken,
} from '../../utils/api';

const asyncRegisterUser = createAsyncThunk(
  'authUser/registerUser',
  async ({ name, email, password }) => {
    await registerApi({ name, email, password });
  },
);

const asyncLoginUser = createAsyncThunk(
  'authUser/loginUser',
  async ({ email, password }) => {
    const token = await loginApi({ email, password });
    putAccessToken(token);
    const user = await getOwnProfile();
    return user;
  },
);

const asyncPreloadAuthUser = createAsyncThunk(
  'authUser/preload',
  async () => {
    if (!getAccessToken()) {
      return null;
    }

    try {
      const user = await getOwnProfile();
      return user;
    } catch (error) {
      removeAccessToken();
      return null;
    }
  },
);

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: {
    user: null,
    isPreload: true,
  },
  reducers: {
    logoutUser: (state) => {
      removeAccessToken();
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncLoginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(asyncPreloadAuthUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isPreload = false;
      })
      .addCase(asyncPreloadAuthUser.rejected, (state) => {
        state.isPreload = false;
      });
  },
});

export const { logoutUser } = authUserSlice.actions;
export { asyncRegisterUser, asyncLoginUser, asyncPreloadAuthUser };
export default authUserSlice.reducer;
