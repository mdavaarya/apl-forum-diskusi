import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import { asyncPopulateLeaderboards } from '../states/leaderboards/leaderboardsSlice';

function LeaderboardsPage() {
  const dispatch = useDispatch();
  const leaderboards = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(asyncPopulateLeaderboards());
  }, [dispatch]);

  return (
    <div className="page">
      <h1 className="page-heading">Leaderboard</h1>
      <p className="page-subheading">Kontributor paling aktif di Ruang Diskusi.</p>

      {leaderboards.length === 0 ? (
        <div className="status-block">Belum ada data leaderboard.</div>
      ) : (
        <div className="leaderboard-list">
          {leaderboards.map((entry, index) => (
            <div className="leaderboard-item" key={entry.user.id}>
              <span className="leaderboard-rank">{index + 1}</span>
              <Avatar src={entry.user.avatar} name={entry.user.name} size={36} />
              <span className="leaderboard-name">{entry.user.name}</span>
              <span className="leaderboard-score">{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaderboardsPage;
