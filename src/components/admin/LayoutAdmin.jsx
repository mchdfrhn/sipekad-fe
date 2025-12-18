import SidebarAdmin from "../sidebar/SidebarAdmin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { Bell } from "lucide-react";

const LayoutAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
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

  if (!isAdmin) {
    return null;
  } else {
    return (
      <main className="max-h-screen text-gray-800 h-screen overflow-hidden bg-gray-100 flex">
        <SidebarAdmin />
        <div className="content-stretch flex-4 pt-4 pl-2 pr-2 overflow-y-scroll overflow-x-hidden mb-8">
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
