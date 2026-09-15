import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncAddComment } from '../states/threads/threadDetailSlice';

function CommentComposer({ threadId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser.user);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authUser) {
    return (
      <button
        type="button"
        className="composer-toggle"
        onClick={() => navigate('/login')}
      >
        Login untuk ikut berkomentar...
      </button>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    await dispatch(asyncAddComment({ threadId, content }));
    setIsSubmitting(false);
    setContent('');
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="comment-content">Tulis komentar</label>
        <textarea
          id="comment-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Bagikan pendapatmu tentang thread ini..."
          required
        />
      </div>
      <div className="composer-actions">
        <button type="submit" className="btn btn-primary btn-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Kirim komentar'}
        </button>
      </div>
    </form>
  );
}

export default CommentComposer;
