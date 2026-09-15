import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import LoadingBar from './components/LoadingBar';
import HomePage from './pages/HomePage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import { asyncPreloadAuthUser } from './states/auth/authUserSlice';

function App() {
  const dispatch = useDispatch();
  const isPreload = useSelector((state) => state.authUser.isPreload);

  useEffect(() => {
    dispatch(asyncPreloadAuthUser());
  }, [dispatch]);

  if (isPreload) {
    return <div className="status-block">Memuat aplikasi...</div>;
  }

  return (
    <div className="app-shell">
      <LoadingBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
