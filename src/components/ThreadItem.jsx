import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Avatar from './Avatar';
import VoteControls from './VoteControls';
import formatRelativeTime from '../utils/formatTime';
import {
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralVoteThread,
} from '../states/threads/threadsSlice';

function ThreadItem({ thread, owner }) {
  const dispatch = useDispatch();
  const excerpt = thread.body.length > 160 ? `${thread.body.slice(0, 160)}...` : thread.body;

  return (
    <article className="thread-item">
      <div className="thread-item-body">
        {thread.category && <span className="thread-category">#{thread.category}</span>}
        <h2 className="thread-title">
          <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
        </h2>
        <p className="thread-excerpt">{excerpt}</p>
        <div className="thread-meta">
          <div className="thread-meta-owner">
            <Avatar src={owner?.avatar} name={owner?.name} size={22} />
            <span>{owner?.name || 'Pengguna'}</span>
          </div>
          <span className="thread-meta-dot" />
          <span>{formatRelativeTime(thread.createdAt)}</span>
          <span className="thread-meta-dot" />
          <span>{thread.totalComments} komentar</span>
        </div>
        <div className="thread-item-votes">
          <VoteControls
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
            onUpVote={() => dispatch(asyncUpVoteThread(thread.id))}
            onDownVote={() => dispatch(asyncDownVoteThread(thread.id))}
            onNeutralVote={() => dispatch(asyncNeutralVoteThread(thread.id))}
          />
        </div>
      </div>
    </article>
  );
}

ThreadItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string),
    downVotesBy: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  owner: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

ThreadItem.defaultProps = {
  owner: null,
};

export default ThreadItem;
