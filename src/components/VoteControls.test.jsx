/**
 * SKENARIO PENGUJIAN KOMPONEN: VoteControls
 *
 * <VoteControls /> component
 *  - harus menampilkan total skor vote dan tombol upvote serta downvote
 *  - harus memanggil onUpVote ketika tombol upvote diklik pengguna login
 *  - harus memanggil onDownVote ketika tombol downvote diklik pengguna login
 *  - harus menampilkan toast info jika tombol diklik pengguna non-login
 */

import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import VoteControls from './VoteControls';

vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
  },
}));

function renderWithStore(ui, { authUser = null } = {}) {
  const store = configureStore({
    reducer: {
      authUser: () => ({ user: authUser, isPreload: false }),
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
}

describe('VoteControls component', () => {
  it('harus menampilkan total skor vote dan tombol upvote serta downvote', () => {
    renderWithStore(
      <VoteControls
        upVotesBy={['user-1', 'user-2']}
        downVotesBy={['user-3']}
        onUpVote={vi.fn()}
        onDownVote={vi.fn()}
        onNeutralVote={vi.fn()}
      />,
    );

    // Score = 2 - 1 = 1
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upvote/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /downvote/i })).toBeInTheDocument();
  });

  it('harus memanggil onUpVote ketika tombol upvote diklik oleh pengguna yang terotentikasi', async () => {
    const handleUpVote = vi.fn();
    const authUser = { id: 'user-login', name: 'Test User' };

    renderWithStore(
      <VoteControls
        upVotesBy={[]}
        downVotesBy={[]}
        onUpVote={handleUpVote}
        onDownVote={vi.fn()}
        onNeutralVote={vi.fn()}
      />,
      { authUser },
    );

    const upVoteBtn = screen.getByRole('button', { name: /^upvote$/i });
    await userEvent.click(upVoteBtn);

    expect(handleUpVote).toHaveBeenCalledTimes(1);
  });

  it('harus memanggil onDownVote ketika tombol downvote diklik oleh pengguna yang terotentikasi', async () => {
    const handleDownVote = vi.fn();
    const authUser = { id: 'user-login', name: 'Test User' };

    renderWithStore(
      <VoteControls
        upVotesBy={[]}
        downVotesBy={[]}
        onUpVote={vi.fn()}
        onDownVote={handleDownVote}
        onNeutralVote={vi.fn()}
      />,
      { authUser },
    );

    const downVoteBtn = screen.getByRole('button', { name: /^downvote$/i });
    await userEvent.click(downVoteBtn);

    expect(handleDownVote).toHaveBeenCalledTimes(1);
  });

  it('harus menampilkan toast info dan tidak memanggil onUpVote ketika diklik oleh pengguna yang belum login', async () => {
    const handleUpVote = vi.fn();

    renderWithStore(
      <VoteControls
        upVotesBy={[]}
        downVotesBy={[]}
        onUpVote={handleUpVote}
        onDownVote={vi.fn()}
        onNeutralVote={vi.fn()}
      />,
      { authUser: null },
    );

    const upVoteBtn = screen.getByRole('button', { name: /upvote/i });
    await userEvent.click(upVoteBtn);

    expect(handleUpVote).not.toHaveBeenCalled();
    expect(toast.info).toHaveBeenCalledWith(
      'Silakan login terlebih dahulu untuk memberikan vote.',
      expect.any(Object),
    );
  });
});
