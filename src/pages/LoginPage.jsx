import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { asyncLoginUser } from '../states/auth/authUserSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await dispatch(asyncLoginUser({ email, password }));
    setIsSubmitting(false);

    if (asyncLoginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="form-panel">
      <div className="form-card">
        <h1 className="form-title">Masuk ke akunmu</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Kata sandi</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <p className="form-footnote">
          Belum punya akun?
          {' '}
          <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
