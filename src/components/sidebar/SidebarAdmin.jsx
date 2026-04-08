import { LayoutDashboard, User, Send, Info, Settings, Database, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { motion as Motion } from "motion/react";

const SidebarAdmin = ({ className, onClose }) => {
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
      name: "Manajemen Pengguna",
      icon: User,
    },
    {
      path: "/admin/backup",
      name: "Backup Sistem",
      icon: Database,
      noFill: true,
    },
    {
      path: "/admin/whatsapp",
      name: "WhatsApp Bot",
      icon: MessageSquare,
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
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center justify-center gap-2 px-8 pb-8"
      >
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
      </Motion.div>

      <Separator className="mb-6 opacity-50" />

      {/* Main Menu */}
      <div className="flex-1 px-4">
        <Motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="space-y-2"
        >
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.path
              : pathname.startsWith(link.path);

            return (
              <Motion.div
                key={link.path}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="relative"
              >
                {isActive && (
                  <Motion.div
                    layoutId="activeIndicator"
                    className="absolute right-[-16px] top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-lg bg-[#4318FF] shadow-[0_0_8px_rgba(67,24,255,0.3)] transition-all duration-300"
                  />
                )}
                <Motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={link.path}
                    className={cn(
                      "group flex items-center gap-4 px-5 py-3 rounded-2xl font-semibold transition-all duration-300",
                      isActive
                        ? "bg-indigo-100/50 text-[#4318FF] font-extrabold shadow-sm"
                        : "text-[#A3AED0] hover:text-[#4318FF] hover:bg-gray-100/50",
                    )}
                    onClick={onClose}
                  >
                  <link.icon
                    size={22}
                    className={cn(
                      "transition-all duration-300",
                      isActive
                        ? "text-[#4318FF] drop-shadow-[0_0_8px_rgba(67,24,255,0.2)]"
                        : "text-[#A3AED0] group-hover:text-[#4318FF]",
                    )}
                    fill={isActive && !link.noFill ? "currentColor" : "none"}
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
                </Motion.div>
              </Motion.div>
            );
          })}
        </Motion.div>
      </div>

      {/* Footer / Support */}
      <div className="px-4 mt-auto pt-6">
        <Separator className="mb-6 opacity-50" />
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Saya mau melaporkan ada bug pada aplikasi SIPEKAD, berikut list bug nya...")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 px-5 py-2 rounded-2xl font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300 shadow-sm border border-red-100/50"
          onClick={onClose}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
            <Info size={18} />
          </div>
          <span className="text-sm tracking-wide">Laporkan Bug</span>
        </a>
      </div>
    </div>
  );
};

export default SidebarAdmin;
