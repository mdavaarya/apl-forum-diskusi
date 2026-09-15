import CommentItem from './CommentItem';

function CommentList({ comments, threadId }) {
  if (comments.length === 0) {
    return (
      <div className="status-block">
        Belum ada komentar. Jadilah yang pertama menanggapi.
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} threadId={threadId} />
      ))}
    </div>
  );
}

export default CommentList;
