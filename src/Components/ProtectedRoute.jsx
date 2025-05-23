// Components/RoleProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/authcontext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
