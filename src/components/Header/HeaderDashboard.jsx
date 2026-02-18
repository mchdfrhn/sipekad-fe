import { Bell, User, Settings, LogOut, HelpCircle } from "lucide-react";
import { useUser } from "../../utils/hooks/userContext";
import { motion as Motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const HeaderDashboard = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <Motion.header
      initial={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5, ease: ["easeInOut"] }}
      className="w-full bg-white shadow-md rounded-2xl mb-8 px-6 py-3 flex justify-between items-center"
    >
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-4 hover:bg-gray-50 rounded-full transition-colors">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm bg-gray-100">
                <AvatarImage src={userData?.url_photo} />
                <AvatarFallback className="bg-blue-100 text-[#4318FF] font-bold text-xs">
                  {getInitials(userData?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-[#2B3674] leading-tight">
                  {userData?.full_name}
                </p>
                <p className="text-[10px] font-medium text-gray-400 uppercase">
                  Student
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[220px] rounded-2xl shadow-xl border-none bg-white p-0 overflow-hidden font-bold"
          >
            <div className="bg-[#4318FF] px-6 py-4 flex flex-col gap-0.5">
              <p className="text-white text-sm font-bold truncate">
                {userData?.full_name}
              </p>
              <p className="text-white/70 text-[10px] uppercase tracking-wider font-medium">
                Student Account
              </p>
            </div>
            <div className="p-2">
              <DropdownMenuItem
                className="cursor-pointer font-bold text-gray-600 focus:bg-indigo-50 focus:text-[#4318FF] rounded-xl px-4 py-2.5 transition-colors"
                onClick={() => navigate("/dashboard/settings")}
              >
                <Settings className="mr-3 h-4 w-4 text-gray-400 group-focus:text-[#4318FF]" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <DropdownMenuItem className="cursor-pointer font-bold text-gray-600 focus:bg-indigo-50 focus:text-[#4318FF] rounded-xl px-4 py-2.5 transition-colors">
                  <HelpCircle className="mr-3 h-4 w-4 text-gray-400 group-focus:text-[#4318FF]" />
                  <span>Contact Support</span>
                </DropdownMenuItem>
              </a>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 hover:text-white hover:bg-red-500 focus:bg-red-500 focus:text-white font-bold transition-all rounded-xl px-4 py-2.5"
                onClick={logoutHandler}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-gray-400 hover:text-[#4318FF] transition-colors"
        >
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </Motion.header>
  );
};

export default HeaderDashboard;
