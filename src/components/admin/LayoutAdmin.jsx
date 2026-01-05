import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { Bell } from "lucide-react";
import { LayoutDashboard, User, Send } from "lucide-react";
import Sidebar from "../sidebar/Sidebar";

const LayoutAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const roleUser = JSON.parse(localStorage.getItem("user"))?.role;
    if (roleUser !== "admin") {
      navigate("/dashboard");
    }

    if (roleUser === "admin") {
      setIsAdmin(true);
    }
  }, [navigate, isAdmin]);

    const links = [
    {
      path: "/admin",
      name: "dashbord",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/user",
      name: "User",
      icon: User,
    },
    {
      path: "/admin/pengajuan",
      name: "Pengajuan",
      icon: Send,
    },
  ];

  if (!isAdmin) {
    return null;
  } else {
    return (
      <main className="text-gray-800 overflow-hidden bg-gray-100 pr-4 pl-4 md:pl-0 min-h-screen">
        <Sidebar activeSidebar={sidebarActive} setActiveSideBar={setSidebarActive} links={links} />
        <div className="p-layout">
          <div className="w-full bg-white shadow-md p-4 rounded-md flex justify-between items-center">
            <h1 className="font-semibold md:text-xl uppercase">
              Admin Dashboard
            </h1>
            <Bell />
          </div>
          <Outlet />
        </div>
      </main>
    );
  }
};

export default LayoutAdmin;
