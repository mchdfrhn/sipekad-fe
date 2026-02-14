import {
  LayoutDashboard,
  LogOut,
  User,
  Send,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Alert from "../ui/Alert";
import { Separator } from "@/components/ui/separator";

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
      exact: true,
    },
    {
      path: "/admin/user",
      name: "User Management",
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
        "flex flex-col h-full bg-white transition-all duration-300 py-6",
        className,
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-3 px-8 pb-8">
        <div className="flex items-center gap-2 font-poppins">
          <img
            src="/sttimage.png"
            alt="stt-logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-2xl font-bold text-[#2B3674] tracking-tight">
            SIPEKAD
          </span>
        </div>
      </div>

      <Separator className="mb-6 opacity-50" />

      {/* Main Menu */}
      <div className="flex-1 px-4">
        {/* <p className="ml-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          Main Menu
        </p> */}
        <div className="space-y-2">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.path
              : pathname.startsWith(link.path);

            return (
              <div key={link.path} className="relative">
                {isActive && (
                  <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 h-9 w-1.5 rounded-l-lg bg-[#4318FF] transition-all duration-300" />
                )}
                <Link
                  to={link.path}
                  className={cn(
                    "group flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50/50 text-[#2B3674] font-bold shadow-sm"
                      : "text-gray-500 hover:text-[#4318FF] hover:bg-gray-50",
                  )}
                >
                  <link.icon
                    size={22}
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-[#4318FF]"
                        : "text-gray-400 group-hover:text-[#4318FF]",
                    )}
                  />
                  <span className="text-sm tracking-wide">{link.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="px-6 mt-auto mb-4">
        {/* Optional Upgrade Card could go here */}

        <button
          className="flex items-center gap-3 px-5 py-3 w-full text-left font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          onClick={() => setIsDisplay(true)}
        >
          <LogOut
            size={20}
            className="text-gray-400 group-hover:text-red-500 transition-colors"
          />
          <span className="text-sm">Log Out</span>
        </button>
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
