import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { asyncAddThread } from '../states/threads/threadsSlice';

function ThreadComposer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser.user);

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authUser) {
    return (
      <button
        type="button"
        className="composer-toggle"
        onClick={() => navigate('/login')}
      >
        Login untuk membuat thread baru...
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        className="composer-toggle"
        onClick={() => setIsOpen(true)}
      >
        Punya topik baru? Mulai diskusi di sini...
      </button>
    );
  }

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setCategory('');
    setBody('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);
    await dispatch(asyncAddThread({ title, body, category: category.trim() || 'umum' }));
    setIsSubmitting(false);
    handleCancel();
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="thread-title">Judul thread</label>
        <input
          id="thread-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul diskusi kamu"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="thread-category">Kategori</label>
        <input
          id="thread-category"
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="mis. teknologi, umum, tanya-jawab"
        />
      </div>
      <div className="form-field">
        <label htmlFor="thread-body">Isi thread</label>
        <textarea
          id="thread-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Ceritakan lebih lanjut tentang topik ini..."
          required
        />
      </div>
      <div className="composer-actions">
        <button type="button" className="btn btn-ghost" onClick={handleCancel}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary btn-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Mengirim...' : 'Publikasikan'}
        </button>
      </div>
    </form>
  );
}

export default ThreadComposer;
