/**
 * SKENARIO PENGUJIAN REDUCER: authUserSlice
 *
 * authUserSlice reducer function
 *  - harus mengembalikan initial state ketika diberikan action yang tidak dikenal
 *  - harus mengubah state.user menjadi null ketika action logoutUser di-dispatch
 *  - harus mengubah state.user ketika asyncLoginUser.fulfilled di-dispatch
 *  - harus mengubah user & set isPreload=false saat asyncPreloadAuthUser.fulfilled
 *  - harus mengubah isPreload menjadi false ketika asyncPreloadAuthUser.rejected
 */

import { describe, it, expect } from 'vitest';
import authUserReducer, {
  logoutUser,
  asyncLoginUser,
  asyncPreloadAuthUser,
} from './authUserSlice';

describe('authUserReducer function', () => {
  it('harus mengembalikan initial state ketika diberikan action yang tidak dikenal', () => {
    const initialState = {
      user: null,
      isPreload: true,
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const nextState = authUserReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('harus mengubah state.user menjadi null ketika action logoutUser di-dispatch', () => {
    const initialState = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      },
      isPreload: false,
    };

    const action = logoutUser();
    const nextState = authUserReducer(initialState, action);

    expect(nextState.user).toBeNull();
  });

  it('harus mengubah state.user dengan data pengguna ketika asyncLoginUser.fulfilled di-dispatch', () => {
    const initialState = {
      user: null,
      isPreload: false,
    };

    const dummyUser = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    };

    const action = {
      type: asyncLoginUser.fulfilled.type,
      payload: dummyUser,
    };

    const nextState = authUserReducer(initialState, action);

    expect(nextState.user).toEqual(dummyUser);
  });

  it('harus mengubah state.user dan mengubah isPreload menjadi false ketika asyncPreloadAuthUser.fulfilled di-dispatch', () => {
    const initialState = {
      user: null,
      isPreload: true,
    };

    const dummyUser = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const action = {
      type: asyncPreloadAuthUser.fulfilled.type,
      payload: dummyUser,
    };

    const nextState = authUserReducer(initialState, action);

    expect(nextState.user).toEqual(dummyUser);
    expect(nextState.isPreload).toBe(false);
  });

  it('sengaja gagal untuk bukti screenshot', () => {
  expect(true).toBe(false);
});

  it('harus mengubah isPreload menjadi false ketika asyncPreloadAuthUser.rejected di-dispatch', () => {
    const initialState = {
      user: null,
      isPreload: true,
    };

    const action = {
      type: asyncPreloadAuthUser.rejected.type,
    };

    const nextState = authUserReducer(initialState, action);

    expect(nextState.user).toBeNull();
    expect(nextState.isPreload).toBe(false);
  });
});
