import { configureStore } from '@reduxjs/toolkit';
import authUserReducer from './auth/authUserSlice';
import usersReducer from './users/usersSlice';
import threadsReducer from './threads/threadsSlice';
import threadDetailReducer from './threads/threadDetailSlice';
import leaderboardsReducer from './leaderboards/leaderboardsSlice';
import loadingBarReducer from './loadingBar/reducer';
import errorMiddleware from './shared/errorMiddleware';

const store = configureStore({
  reducer: {
    authUser: authUserReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    loadingBar: loadingBarReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorMiddleware),
});

export default store;
