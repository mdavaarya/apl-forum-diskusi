import { useSelector } from 'react-redux';

function LoadingBar() {
  const activeRequests = useSelector((state) => state.loadingBar);

  if (activeRequests === 0) return null;

  return <div className="loading-bar" role="status" aria-label="Memuat data" />;
}

export default LoadingBar;
