import { Navigate, Outlet } from "react-router";
import { useUser } from "../../utils/hooks/userContext";

const PublicRoute = () => {
  const { isSessionValid, userData } = useUser();

  if (isSessionValid()) {
    if (userData.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
