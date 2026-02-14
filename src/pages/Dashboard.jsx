import { Outlet, useNavigate } from "react-router";
import Sidebar from "../components/sidebar/Sidebar";
import HeaderDashboard from "../components/Header/HeaderDashboard";
import { useState, useEffect } from "react";
import { LayoutDashboard, User, Send, Settings } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarActive, setSidebarActive] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("tokenKey");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      navigate("/");
    }
  }, [navigate]);

  if (!isLogin) {
    return null;
  }
  const links = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/dashboard/request",
      name: "Buat Permintaan",
      icon: Send,
    },
    {
      path: "/dashboard/user",
      name: "User",
      icon: User,
    },
  ];
  return (
    <>
      <main className="bg-gray-100 min-h-screen">
        <Sidebar
          links={links}
          activeSidebar={sidebarActive}
          setActiveSideBar={setSidebarActive}
        />
        <div className="overflow-y-scroll p-6 md:ml-58 transition-all duration-300 ease-in-out">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
