import { Outlet } from "react-router";
import { useLocation } from "react-router";
const DashboardRequest = () => {
  const { pathname } = useLocation();
  return (
    <div className="p-layout">
      <p className="text-[8px] md:text-xl text-gray-400 mb-4 md:tracking-[3px] uppercase font-semibold">
        {pathname}
      </p>
      <Outlet />
    </div>
  );
};

export default DashboardRequest;
