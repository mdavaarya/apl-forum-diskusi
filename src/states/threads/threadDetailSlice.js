import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getThreadDetail,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '../../utils/api';

const asyncGetThreadDetail = createAsyncThunk(
  'threadDetail/get',
  async (threadId) => {
    const detailThread = await getThreadDetail(threadId);
    return detailThread;
  },
);

const asyncAddComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }, { getState }) => {
    const comment = await createComment({ threadId, content });
    const { user } = getState().authUser;

    return {
      ...comment,
      owner: user,
      upVotesBy: [],
      downVotesBy: [],
    };
  },
);

function applyVote(entity, userId, voteType) {
  const upVotesBy = entity.upVotesBy.filter((id) => id !== userId);
  const downVotesBy = entity.downVotesBy.filter((id) => id !== userId);

  if (voteType === 'up') upVotesBy.push(userId);
  if (voteType === 'down') downVotesBy.push(userId);

  return { ...entity, upVotesBy, downVotesBy };
}

function getCurrentVoteType(entity, userId) {
  if (entity.upVotesBy.includes(userId)) return 'up';
  if (entity.downVotesBy.includes(userId)) return 'down';
  return 'neutral';
}

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    clearThreadDetail: () => null,
    setThreadDetailVote: (state, action) => {
      const { userId, voteType } = action.payload;
      return applyVote(state, userId, voteType);
    },
    setCommentVote: (state, action) => {
      const { commentId, userId, voteType } = action.payload;
      state.comments = state.comments.map((comment) => (
        comment.id === commentId ? applyVote(comment, userId, voteType) : comment
      ));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetThreadDetail.fulfilled, (state, action) => action.payload)
      .addCase(asyncAddComment.fulfilled, (state, action) => {
        state.comments = [action.payload, ...state.comments];
      });
  },
});

export const {
  clearThreadDetail,
  setThreadDetailVote,
  setCommentVote,
} = threadDetailSlice.actions;

export { asyncGetThreadDetail, asyncAddComment };

function makeThreadVoteThunk(voteType, apiCall) {
  return function voteThunk(threadId) {
    return async (dispatch, getState) => {
      const { authUser, threadDetail } = getState();
      const userId = authUser.user?.id;
      if (!userId || !threadDetail) return;

      const previous = threadDetail;
      dispatch(setThreadDetailVote({ userId, voteType }));

      try {
        await apiCall(threadId);
      } catch (error) {
        dispatch(setThreadDetailVote({
          userId,
          voteType: getCurrentVoteType(previous, userId),
        }));
      }
    };
  };
}

function makeCommentVoteThunk(voteType, apiCall) {
  return function voteThunk({ threadId, commentId }) {
    return async (dispatch, getState) => {
      const { authUser, threadDetail } = getState();
      const userId = authUser.user?.id;
      if (!userId || !threadDetail) return;

      const previousComment = threadDetail.comments.find((comment) => comment.id === commentId);

      dispatch(setCommentVote({ commentId, userId, voteType }));

      try {
        await apiCall({ threadId, commentId });
      } catch (error) {
        if (previousComment) {
          dispatch(setCommentVote({
            commentId,
            userId,
            voteType: getCurrentVoteType(previousComment, userId),
          }));
        }
      }
    };
  };
}

export const asyncUpVoteThreadDetail = makeThreadVoteThunk('up', upVoteThread);
export const asyncDownVoteThreadDetail = makeThreadVoteThunk('down', downVoteThread);
export const asyncNeutralVoteThreadDetail = makeThreadVoteThunk('neutral', neutralVoteThread);

export const asyncUpVoteComment = makeCommentVoteThunk('up', upVoteComment);
export const asyncDownVoteComment = makeCommentVoteThunk('down', downVoteComment);
export const asyncNeutralVoteComment = makeCommentVoteThunk('neutral', neutralVoteComment);

export default threadDetailSlice.reducer;
