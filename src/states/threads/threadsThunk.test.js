/**
 * SKENARIO PENGUJIAN THUNK: threadsThunk (asyncPopulateThreads & asyncUpVoteThread)
 *
 * asyncPopulateThreads thunk
 *  - harus men-dispatch action dan mengembalikan array thread ketika data fetching berhasil
 *  - harus men-dispatch action rejected ketika data fetching gagal
 *
 * asyncUpVoteThread thunk (optimistic update)
 *  - harus men-dispatch setThreadVote optimis & panggil upVoteThread saat login
 *  - harus mengembalikan (revert) vote ke kondisi sebelumnya jika request API gagal
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
import {
  asyncPopulateThreads,
  asyncUpVoteThread,
  setThreadVote,
} from './threadsSlice';

vi.mock('../../utils/api', () => ({
  getAllThreads: vi.fn(),
  createThread: vi.fn(),
  upVoteThread: vi.fn(),
  downVoteThread: vi.fn(),
  neutralVoteThread: vi.fn(),
}));

const fakeThreadsResponse = [
  {
    id: 'thread-1',
    title: 'Thread 1',
    body: 'Isi thread 1',
    category: 'general',
    upVotesBy: [],
    downVotesBy: [],
  },
  {
    id: 'thread-2',
    title: 'Thread 2',
    body: 'Isi thread 2',
    category: 'react',
    upVotesBy: ['user-1'],
    downVotesBy: [],
  },
];

const fakeErrorResponse = new Error('Gagal memuat threads');

describe('threads thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('asyncPopulateThreads thunk', () => {
    it('harus men-dispatch action dan mengembalikan array thread ketika data fetching berhasil', async () => {
      // Arrange
      vi.mocked(api.getAllThreads).mockResolvedValue(fakeThreadsResponse);
      const dispatch = vi.fn();

      // Action
      const thunk = asyncPopulateThreads();
      const result = await thunk(dispatch, () => ({}), undefined);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: asyncPopulateThreads.pending.type }),
      );
      expect(api.getAllThreads).toHaveBeenCalled();
      expect(result.payload).toEqual(fakeThreadsResponse);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: asyncPopulateThreads.fulfilled.type,
          payload: fakeThreadsResponse,
        }),
      );
    });

    it('harus men-dispatch action rejected ketika data fetching gagal', async () => {
      // Arrange
      vi.mocked(api.getAllThreads).mockRejectedValue(fakeErrorResponse);
      const dispatch = vi.fn();

      // Action
      const thunk = asyncPopulateThreads();
      const result = await thunk(dispatch, () => ({}), undefined);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: asyncPopulateThreads.pending.type }),
      );
      expect(api.getAllThreads).toHaveBeenCalled();
      expect(result.type).toBe(asyncPopulateThreads.rejected.type);
    });
  });

  describe('asyncUpVoteThread thunk (optimistic update)', () => {
    it('harus men-dispatch setThreadVote secara optimis dan memanggil API upVoteThread ketika user login', async () => {
      // Arrange
      vi.mocked(api.upVoteThread).mockResolvedValue();
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { user: { id: 'user-1' } },
        threads: {
          items: [
            {
              id: 'thread-1',
              upVotesBy: [],
              downVotesBy: [],
            },
          ],
        },
      });

      // Action
      await asyncUpVoteThread('thread-1')(dispatch, getState);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(
        setThreadVote({
          threadId: 'thread-1',
          userId: 'user-1',
          voteType: 'up',
        }),
      );
      expect(api.upVoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('harus mengembalikan (revert) vote ke kondisi sebelumnya jika request API gagal', async () => {
      // Arrange
      vi.mocked(api.upVoteThread).mockRejectedValue(new Error('Koneksi terputus'));
      const dispatch = vi.fn();
      const getState = () => ({
        authUser: { user: { id: 'user-1' } },
        threads: {
          items: [
            {
              id: 'thread-1',
              upVotesBy: [],
              downVotesBy: ['user-1'], // sebelumnya downvoted
            },
          ],
        },
      });

      // Action
      await asyncUpVoteThread('thread-1')(dispatch, getState);

      // Assert: Dispatch vote baru dulu (optimistis)
      expect(dispatch).toHaveBeenNthCalledWith(
        1,
        setThreadVote({
          threadId: 'thread-1',
          userId: 'user-1',
          voteType: 'up',
        }),
      );

      // Assert: Lalu revert kembali ke 'down' karena API gagal
      expect(dispatch).toHaveBeenNthCalledWith(
        2,
        setThreadVote({
          threadId: 'thread-1',
          userId: 'user-1',
          voteType: 'down',
        }),
      );
    });
  });
});
