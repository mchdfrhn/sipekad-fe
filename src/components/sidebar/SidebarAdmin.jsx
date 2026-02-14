import { LayoutDashboard, User, Send } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const SidebarAdmin = ({ className }) => {
  const { pathname } = useLocation();

  const links = [
    {
      path: "/admin",
      name: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      path: "/admin/pengajuan",
      name: "Pengajuan",
      icon: Send,
    },
    {
      path: "/admin/user",
      name: "User Management",
      icon: User,
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
      <div className="flex flex-col items-center justify-center gap-2 px-8 pb-8">
        <img
          src="/sttimage.png"
          alt="stt-logo"
          className="w-16 h-16 object-contain"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2B3674] tracking-tight">
            SIPEKAD
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Sistem Pengajuan Akademik
          </p>
        </div>
      </div>

      <Separator className="mb-6 opacity-50" />

      {/* Main Menu */}
      <div className="flex-1 px-4">
        <div className="space-y-2">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.path
              : pathname.startsWith(link.path);

            return (
              <div key={link.path} className="relative">
                {isActive && (
                  <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 h-10 w-1.5 rounded-l-lg bg-[#4318FF] shadow-[0_0_12px_rgba(67,24,255,0.4)] transition-all duration-300" />
                )}
                <Link
                  to={link.path}
                  className={cn(
                    "group flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-300",
                    isActive
                      ? "bg-indigo-50 text-[#2B3674] font-extrabold shadow-sm scale-[1.02]"
                      : "text-[#A3AED0] hover:text-[#4318FF] hover:bg-gray-50",
                  )}
                >
                  <link.icon
                    size={isActive ? 24 : 22}
                    className={cn(
                      "transition-all duration-300",
                      isActive
                        ? "text-[#4318FF] drop-shadow-[0_0_8px_rgba(67,24,255,0.2)]"
                        : "text-[#A3AED0] group-hover:text-[#4318FF]",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm tracking-wide transition-colors",
                      isActive ? "text-[#2B3674]" : "text-[#A3AED0]",
                    )}
                  >
                    {link.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
