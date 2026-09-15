import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { asyncRegisterUser } from '../states/auth/authUserSlice';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await dispatch(asyncRegisterUser({ name, email, password }));
    setIsSubmitting(false);

    if (asyncRegisterUser.fulfilled.match(result)) {
      toast.success('Pendaftaran berhasil, silakan masuk.');
      navigate('/login');
    }
  };

  return (
    <div className="form-panel">
      <div className="form-card">
        <h1 className="form-title">Buat akun baru</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="register-name">Nama</label>
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-password">Kata sandi</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        <p className="form-footnote">
          Sudah punya akun?
          {' '}
          <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
