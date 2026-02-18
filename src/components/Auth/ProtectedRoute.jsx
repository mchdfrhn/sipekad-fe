import { Navigate, Outlet } from "react-router";
import { useUser } from "../../utils/hooks/userContext";

const ProtectedRoute = () => {
  const { isSessionValid } = useUser();

  if (!isSessionValid()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
