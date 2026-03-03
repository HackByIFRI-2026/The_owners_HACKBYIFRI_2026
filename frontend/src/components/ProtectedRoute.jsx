import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useAuthStore();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si on doit filtrer par Rôle (ex: ["PROFESSOR"])
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Si l'utilisateur vient de se connecter via Google et n'a pas fini (ex: rôle manquant)
    if (user && !user.isProfileComplete && location.pathname !== '/complete-profile') {
        return <Navigate to="/complete-profile" replace />;
    }

    return children;
};

export default ProtectedRoute;
