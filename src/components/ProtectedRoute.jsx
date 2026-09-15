import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const authUser = useSelector((state) => state.authUser.user);

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
