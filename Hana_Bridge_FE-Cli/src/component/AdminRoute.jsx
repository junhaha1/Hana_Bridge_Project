import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userRole = useSelector((state) => state.user.role);

  // ROLE_ADMIN이 아닌 경우 홈으로 리다이렉트
  if (userRole !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 