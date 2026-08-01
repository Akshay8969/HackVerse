import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const DashboardRouter = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;

  const routes = {
    admin: '/dashboard/admin',
    organizer: '/dashboard/organizer',
    participant: '/dashboard/participant',
    judge: '/dashboard/judge',
  };

  return <Navigate to={routes[user?.role] || '/hackathons'} replace />;
};

export default DashboardRouter;
