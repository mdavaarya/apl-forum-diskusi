import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../states/auth/authUserSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <Link to="/" className="masthead-title">Ruang Diskusi</Link>
        <nav className="masthead-nav">
          <NavLink to="/" end>Thread</NavLink>
          <NavLink to="/leaderboards">Leaderboard</NavLink>
          {authUser ? (
            <>
              <span className="masthead-user">{authUser.name}</span>
              <button type="button" onClick={handleLogout}>Keluar</button>
            </>
          ) : (
            <>
              <Link to="/login">Masuk</Link>
              <Link to="/register">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
