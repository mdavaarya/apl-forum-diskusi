/**
 * SKENARIO PENGUJIAN THUNK: authUserThunk (asyncLoginUser)
 *
 * asyncLoginUser thunk
 *  - harus men-dispatch action dan mengembalikan data pengguna ketika login berhasil
 *  - harus men-dispatch action dan melempar error ketika login gagal
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';
import * as api from '../../utils/api';
import { asyncLoginUser } from './authUserSlice';

vi.mock('../../utils/api', () => ({
  login: vi.fn(),
  putAccessToken: vi.fn(),
  getOwnProfile: vi.fn(),
  getAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));

const fakeLoginPayload = {
  email: 'user@example.com',
  password: 'secretpassword',
};

const fakeToken = 'dummy-auth-token-12345';

const fakeUserResponse = {
  id: 'user-1',
  name: 'John Doe',
  email: 'user@example.com',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe',
};

const fakeErrorResponse = new Error('Email atau password salah');

describe('asyncLoginUser thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('harus men-dispatch action dan mengembalikan data pengguna ketika login berhasil', async () => {
    // Arrange
    vi.mocked(api.login).mockResolvedValue(fakeToken);
    vi.mocked(api.getOwnProfile).mockResolvedValue(fakeUserResponse);
    const dispatch = vi.fn();

    // Action
    const thunk = asyncLoginUser(fakeLoginPayload);
    const result = await thunk(dispatch, () => ({}), undefined);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: asyncLoginUser.pending.type }),
    );
    expect(api.login).toHaveBeenCalledWith(fakeLoginPayload);
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken);
    expect(api.getOwnProfile).toHaveBeenCalled();
    expect(result.payload).toEqual(fakeUserResponse);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: asyncLoginUser.fulfilled.type,
        payload: fakeUserResponse,
      }),
    );
  });

  it('harus men-dispatch action dan melempar error ketika login gagal', async () => {
    // Arrange
    vi.mocked(api.login).mockRejectedValue(fakeErrorResponse);
    const dispatch = vi.fn();

    // Action
    const thunk = asyncLoginUser(fakeLoginPayload);
    const result = await thunk(dispatch, () => ({}), undefined);

    // Assert
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: asyncLoginUser.pending.type }),
    );
    expect(api.login).toHaveBeenCalledWith(fakeLoginPayload);
    expect(api.putAccessToken).not.toHaveBeenCalled();
    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(result.type).toBe(asyncLoginUser.rejected.type);
    expect(result.error.message).toBe('Email atau password salah');
  });
});
