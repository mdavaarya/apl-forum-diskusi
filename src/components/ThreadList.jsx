import ThreadItem from './ThreadItem';

function ThreadList({ threads, users }) {
  if (threads.length === 0) {
    return (
      <div className="status-block">
        Belum ada thread pada kategori ini. Jadilah yang pertama membuat diskusi!
      </div>
    );
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          owner={users.find((user) => user.id === thread.ownerId)}
        />
      ))}
    </div>
  );
}

export default ThreadList;
