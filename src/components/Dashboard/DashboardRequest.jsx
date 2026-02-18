import { Outlet } from "react-router";
const DashboardRequest = () => {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
};

export default DashboardRequest;
