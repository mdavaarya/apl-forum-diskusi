/**
 * SKENARIO PENGUJIAN REDUCER: threadsSlice
 *
 * threadsSlice reducer function
 *  - harus mengembalikan initial state ketika diberikan action yang tidak dikenal
 *  - harus mengubah filterCategory ketika action setFilterCategory di-dispatch
 *  - harus mengisi items dengan array thread saat asyncPopulateThreads.fulfilled
 *  - harus menambahkan thread baru di awal items saat asyncAddThread.fulfilled
 *  - harus memperbarui status vote thread ketika setThreadVote di-dispatch
 */

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setFilterCategory,
  setThreadVote,
  asyncPopulateThreads,
  asyncAddThread,
} from './threadsSlice';

describe('threadsReducer function', () => {
  it('harus mengembalikan initial state ketika diberikan action yang tidak dikenal', () => {
    const initialState = {
      items: [],
      filterCategory: 'all',
    };

    const action = { type: 'UNKNOWN_ACTION' };
    const nextState = threadsReducer(initialState, action);

    expect(nextState).toEqual(initialState);
  });

  it('harus mengubah filterCategory ketika action setFilterCategory di-dispatch', () => {
    const initialState = {
      items: [],
      filterCategory: 'all',
    };

    const action = setFilterCategory('react');
    const nextState = threadsReducer(initialState, action);

    expect(nextState.filterCategory).toBe('react');
  });

  it('harus mengisi items dengan array data thread ketika asyncPopulateThreads.fulfilled di-dispatch', () => {
    const initialState = {
      items: [],
      filterCategory: 'all',
    };

    const dummyThreads = [
      {
        id: 'thread-1',
        title: 'Thread Pertama',
        body: 'Ini isi thread pertama',
        category: 'general',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
      {
        id: 'thread-2',
        title: 'Thread Kedua',
        body: 'Ini isi thread kedua',
        category: 'redux',
        upVotesBy: ['user-1'],
        downVotesBy: [],
        totalComments: 2,
      },
    ];

    const action = {
      type: asyncPopulateThreads.fulfilled.type,
      payload: dummyThreads,
    };

    const nextState = threadsReducer(initialState, action);

    expect(nextState.items).toEqual(dummyThreads);
  });

  it('harus menambahkan thread baru di urutan pertama items ketika asyncAddThread.fulfilled di-dispatch', () => {
    const initialState = {
      items: [
        {
          id: 'thread-1',
          title: 'Thread Lama',
          body: 'Isi thread lama',
          category: 'general',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
      filterCategory: 'all',
    };

    const newThread = {
      id: 'thread-2',
      title: 'Thread Baru',
      body: 'Isi thread baru',
      category: 'react',
      upVotesBy: [],
      downVotesBy: [],
    };

    const action = {
      type: asyncAddThread.fulfilled.type,
      payload: newThread,
    };

    const nextState = threadsReducer(initialState, action);

    expect(nextState.items).toHaveLength(2);
    expect(nextState.items[0]).toEqual(newThread);
  });

  it('harus memperbarui upVotesBy dan downVotesBy pada thread yang tepat ketika setThreadVote di-dispatch', () => {
    const initialState = {
      items: [
        {
          id: 'thread-1',
          title: 'Thread Uji',
          body: 'Isi thread uji',
          category: 'testing',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
      filterCategory: 'all',
    };

    // 1. Berikan Upvote oleh user-1
    const upVoteAction = setThreadVote({
      threadId: 'thread-1',
      userId: 'user-1',
      voteType: 'up',
    });
    const stateAfterUpVote = threadsReducer(initialState, upVoteAction);

    expect(stateAfterUpVote.items[0].upVotesBy).toContain('user-1');
    expect(stateAfterUpVote.items[0].downVotesBy).not.toContain('user-1');

    // 2. Ubah menjadi Downvote oleh user-1
    const downVoteAction = setThreadVote({
      threadId: 'thread-1',
      userId: 'user-1',
      voteType: 'down',
    });
    const stateAfterDownVote = threadsReducer(stateAfterUpVote, downVoteAction);

    expect(stateAfterDownVote.items[0].upVotesBy).not.toContain('user-1');
    expect(stateAfterDownVote.items[0].downVotesBy).toContain('user-1');

    // 3. Ubah menjadi Netral oleh user-1
    const neutralVoteAction = setThreadVote({
      threadId: 'thread-1',
      userId: 'user-1',
      voteType: 'neutral',
    });
    const stateAfterNeutral = threadsReducer(stateAfterDownVote, neutralVoteAction);

    expect(stateAfterNeutral.items[0].upVotesBy).not.toContain('user-1');
    expect(stateAfterNeutral.items[0].downVotesBy).not.toContain('user-1');
  });
});
