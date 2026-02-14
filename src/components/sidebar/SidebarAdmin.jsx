import { LayoutDashboard, LogOut, User, Send } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Alert from "../ui/Alert";

const SidebarAdmin = ({ className }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isDisplay, setIsDisplay] = useState(false);

  const logoutHandler = async () => {
    const token = localStorage.getItem("tokenKey");

    if (token) {
      navigate("/");
      localStorage.removeItem("tokenKey");
      localStorage.removeItem("user");
    }
  };

  const links = [
    {
      path: "/admin",
      name: "Dashboard",
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

  return (
    <div
      className={cn(
        "pb-12 min-h-screen bg-white transition-all duration-300",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-6 py-8 flex items-center justify-center border-b-[1px] border-gray-100 pb-8">
          <img
            src="/sttimage.png"
            alt="stt-logo"
            loading="lazy"
            className="w-40 transition-all hover:scale-105"
          />
        </div>
        <div className="px-4 py-4">
          <div className="space-y-1 mt-4">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <div key={link.path} className="relative mb-2">
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-1.5 rounded-l-lg bg-[#4318FF]" />
                  )}
                  <Link
                    to={link.path}
                    className={cn(
                      "group flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-200 mx-2",
                      isActive
                        ? "bg-gray-100/50 text-[#2B3674] font-bold"
                        : "text-[#A3AED0] hover:text-[#2B3674] hover:bg-gray-50",
                    )}
                  >
                    <link.icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isActive
                          ? "text-[#4318FF]"
                          : "text-[#A3AED0] group-hover:text-[#4318FF]",
                      )}
                    />
                    <span className={cn(isActive ? "text-[#2B3674]" : "")}>
                      {link.name}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 py-2 mt-auto">
          <div className="relative">
            <button
              className="flex items-center gap-4 px-5 py-4 w-full text-left font-medium text-[#A3AED0] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              onClick={() => setIsDisplay(true)}
            >
              <LogOut className="h-6 w-6" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {isDisplay && (
        <Alert
          setDisplay={setIsDisplay}
          isDisplay={isDisplay}
          onYesHundler={logoutHandler}
        />
      )}
    </div>
  );
};

export default SidebarAdmin;
