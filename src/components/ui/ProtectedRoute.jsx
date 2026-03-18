import { Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function ProtectedRoute() {
    // Bypass authentication entirely
    return <Outlet />;
}
