import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/api';

const ProtectedRoute = ({ element, allowedTypes }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedTypes.includes(user.type)) return <Navigate to="/unauthorized" replace />;
  return element;
};

export default ProtectedRoute;
