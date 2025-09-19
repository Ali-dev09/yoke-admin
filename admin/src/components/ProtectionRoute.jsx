
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';

export default function ProtectionRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return null;
}
