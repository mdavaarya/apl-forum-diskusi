import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function VoteControls({
  upVotesBy,
  downVotesBy,
  onUpVote,
  onDownVote,
  onNeutralVote,
}) {
  const authUser = useSelector((state) => state.authUser.user);
  const score = upVotesBy.length - downVotesBy.length;
  const hasUpVoted = authUser && upVotesBy.includes(authUser.id);
  const hasDownVoted = authUser && downVotesBy.includes(authUser.id);

  const handleUnauthenticatedVote = () => {
    toast.info('Silakan login terlebih dahulu untuk memberikan vote.', {
      toastId: 'auth-vote-required',
    });
  };

  const handleUpVote = () => {
    if (!authUser) {
      handleUnauthenticatedVote();
      return;
    }
    if (hasUpVoted) {
      onNeutralVote();
    } else {
      onUpVote();
    }
  };

  const handleDownVote = () => {
    if (!authUser) {
      handleUnauthenticatedVote();
      return;
    }
    if (hasDownVoted) {
      onNeutralVote();
    } else {
      onDownVote();
    }
  };

  return (
    <div className={`vote-controls ${!authUser ? 'vote-controls-unauth' : ''}`}>
      <button
        type="button"
        className={`vote-btn ${hasUpVoted ? 'voted-up' : ''}`}
        onClick={handleUpVote}
        aria-label={authUser ? 'Upvote' : 'Upvote (login untuk vote)'}
      >
        &#9650;
      </button>
      <span className="vote-count">{score}</span>
      <button
        type="button"
        className={`vote-btn ${hasDownVoted ? 'voted-down' : ''}`}
        onClick={handleDownVote}
        aria-label={authUser ? 'Downvote' : 'Downvote (login untuk vote)'}
      >
        &#9660;
      </button>
      {!authUser && (
        <span className="vote-tooltip" role="tooltip">
          Login untuk vote
        </span>
      )}
    </div>
  );
}

VoteControls.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string),
  downVotesBy: PropTypes.arrayOf(PropTypes.string),
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
  onNeutralVote: PropTypes.func.isRequired,
};

VoteControls.defaultProps = {
  upVotesBy: [],
  downVotesBy: [],
};

export default VoteControls;
