import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Avatar from './Avatar';
import VoteControls from './VoteControls';
import formatRelativeTime from '../utils/formatTime';
import {
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralVoteComment,
} from '../states/threads/threadDetailSlice';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();

  return (
    <div className="comment-item">
      <Avatar src={comment.owner?.avatar} name={comment.owner?.name} size={30} />
      <div className="comment-body">
        <div className="comment-meta">
          <span className="comment-owner">{comment.owner?.name || 'Pengguna'}</span>
          <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="comment-content">{comment.content}</p>
        <VoteControls
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          onUpVote={() => dispatch(asyncUpVoteComment({ threadId, commentId: comment.id }))}
          onDownVote={() => dispatch(asyncDownVoteComment({ threadId, commentId: comment.id }))}
          onNeutralVote={() => (
            dispatch(asyncNeutralVoteComment({ threadId, commentId: comment.id }))
          )}
        />
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
    owner: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
