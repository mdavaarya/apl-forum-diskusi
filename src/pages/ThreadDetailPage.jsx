import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import VoteControls from '../components/VoteControls';
import CommentList from '../components/CommentList';
import CommentComposer from '../components/CommentComposer';
import formatRelativeTime from '../utils/formatTime';
import {
  asyncGetThreadDetail,
  clearThreadDetail,
  asyncUpVoteThreadDetail,
  asyncDownVoteThreadDetail,
  asyncNeutralVoteThreadDetail,
} from '../states/threads/threadDetailSlice';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const detailThread = useSelector((state) => state.threadDetail);

  useEffect(() => {
    dispatch(asyncGetThreadDetail(threadId));

    return () => {
      dispatch(clearThreadDetail());
    };
  }, [dispatch, threadId]);

  if (!detailThread) {
    return <div className="status-block">Memuat thread...</div>;
  }

  return (
    <div className="page">
      <div className="thread-detail-header">
        {detailThread.category && <span className="thread-category">#{detailThread.category}</span>}
        <h1 className="thread-detail-title">{detailThread.title}</h1>
        <p className="thread-detail-body">{detailThread.body}</p>
        <div className="thread-detail-footer">
          <div className="thread-meta-owner">
            <Avatar src={detailThread.owner?.avatar} name={detailThread.owner?.name} size={28} />
            <span>{detailThread.owner?.name}</span>
            <span className="thread-meta-dot" />
            <span>{formatRelativeTime(detailThread.createdAt)}</span>
          </div>
          <VoteControls
            upVotesBy={detailThread.upVotesBy}
            downVotesBy={detailThread.downVotesBy}
            onUpVote={() => dispatch(asyncUpVoteThreadDetail(threadId))}
            onDownVote={() => dispatch(asyncDownVoteThreadDetail(threadId))}
            onNeutralVote={() => dispatch(asyncNeutralVoteThreadDetail(threadId))}
          />
        </div>
      </div>

      <h2 className="comments-heading">
        {detailThread.comments.length}
        {' '}
        Komentar
      </h2>
      <CommentComposer threadId={threadId} />
      <CommentList comments={detailThread.comments} threadId={threadId} />
    </div>
  );
}

export default ThreadDetailPage;
