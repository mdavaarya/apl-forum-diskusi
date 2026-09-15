import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllThreads,
  createThread,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
} from '../../utils/api';

const asyncPopulateThreads = createAsyncThunk(
  'threads/populateThreads',
  async () => {
    const threads = await getAllThreads();
    return threads;
  },
);

const asyncAddThread = createAsyncThunk(
  'threads/addThread',
  async ({ title, body, category }) => {
    const thread = await createThread({ title, body, category });
    return thread;
  },
);

/**
 * Menghitung ulang upVotesBy/downVotesBy sebuah thread secara lokal
 * (dipakai untuk optimistic update sebelum request API selesai).
 */
function applyVote(thread, userId, voteType) {
  const upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
  const downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

  if (voteType === 'up') {
    upVotesBy.push(userId);
  } else if (voteType === 'down') {
    downVotesBy.push(userId);
  }

  return { ...thread, upVotesBy, downVotesBy };
}

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    filterCategory: 'all',
  },
  reducers: {
    setThreadVote: (state, action) => {
      const { threadId, userId, voteType } = action.payload;
      state.items = state.items.map((thread) => (
        thread.id === threadId ? applyVote(thread, userId, voteType) : thread
      ));
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncPopulateThreads.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(asyncAddThread.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      });
  },
});

export const { setThreadVote, setFilterCategory } = threadsSlice.actions;
export { asyncPopulateThreads, asyncAddThread };

/**
 * Optimistic vote thunks: state di-update dulu secara lokal supaya UI
 * langsung responsif, baru kemudian request dikirim ke API. Jika request
 * gagal, vote dikembalikan ke kondisi semula (revert).
 */
function getCurrentVoteType(thread, userId) {
  if (thread.upVotesBy.includes(userId)) return 'up';
  if (thread.downVotesBy.includes(userId)) return 'down';
  return 'neutral';
}

function makeVoteThunk(voteType, apiCall) {
  return function voteThunk(threadId) {
    return async (dispatch, getState) => {
      const { authUser, threads } = getState();
      const userId = authUser.user?.id;

      if (!userId) return;

      const previousThread = threads.items.find((thread) => thread.id === threadId);

      dispatch(setThreadVote({ threadId, userId, voteType }));

      try {
        await apiCall(threadId);
      } catch (error) {
        if (previousThread) {
          dispatch(setThreadVote({
            threadId,
            userId,
            voteType: getCurrentVoteType(previousThread, userId),
          }));
        }
      }
    };
  };
}

export const asyncUpVoteThread = makeVoteThunk('up', upVoteThread);
export const asyncDownVoteThread = makeVoteThunk('down', downVoteThread);
export const asyncNeutralVoteThread = makeVoteThunk('neutral', neutralVoteThread);

export default threadsSlice.reducer;
