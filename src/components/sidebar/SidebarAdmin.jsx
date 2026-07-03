import { LayoutDashboard, User, Send, Info, Database, MessageSquare, Shield } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { motion as Motion } from "motion/react";

const links = [
  { path: "/admin", name: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/pengajuan", name: "Pengajuan", icon: Send },
  { path: "/admin/user", name: "Manajemen Pengguna", icon: User },
  { path: "/admin/backup", name: "Backup Sistem", icon: Database, noFill: true },
  { path: "/admin/whatsapp", name: "WhatsApp Bot", icon: MessageSquare },
];

const WA_TEXT = encodeURIComponent("Saya mau melaporkan ada bug pada aplikasi SIPEKAD, berikut list bug nya...");

const SidebarAdmin = ({ className, onClose }) => {
  const { pathname } = useLocation();

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r transition-all duration-300 font-jakarta",
        className,
      )}
      style={{ borderRight: "1px solid rgba(67,24,255,0.06)" }}
    >
      {/* Logo */}
      <Motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-4 mt-4 rounded-2xl px-4 py-5 flex items-center gap-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/30"
      >
        <img
          src="/sttimage.png"
          alt="sipekad-logo"
          className="w-12 h-12 rounded-2xl shadow-md object-contain flex-shrink-0"
        />
        <div>
          <h1
            className="text-2xl font-black leading-tight"
            style={{
              background: "linear-gradient(135deg, #4318FF, #7C5FFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SIPEKAD
          </h1>
          <p className="text-[10px] tracking-widest text-[#718096] uppercase mt-0.5">
            Sistem Pengajuan Akademik
          </p>
        </div>
      </Motion.div>

      <Separator className="mx-4 my-3" style={{ borderColor: "rgba(67,24,255,0.10)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.path
            : pathname.startsWith(link.path);
          const Icon = link.icon;

          return (
            <Motion.div
              key={link.path}
              className="relative"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
            >
              {isActive && (
                <Motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(67,24,255,0.08), rgba(124,95,255,0.05))",
                    borderLeft: "3px solid #4318FF",
                    borderRadius: "0 12px 12px 0",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Link
                to={link.path}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200",
                  isActive
                    ? "text-[#4318FF] font-bold"
                    : "text-[#718096] hover:text-[#4318FF] hover:bg-[#F8F9FF]",
                )}
              >
                <Icon
                  size={20}
                  fill={isActive && !link.noFill ? "currentColor" : "none"}
                  className="flex-shrink-0 transition-colors duration-200"
                />
                <span className="tracking-wide">{link.name}</span>
              </Link>
            </Motion.div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 mt-auto space-y-3">
        <Separator style={{ borderColor: "rgba(67,24,255,0.10)" }} />

        {/* Admin badge card */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50/60 to-purple-50/40">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#4318FF]/10 flex-shrink-0">
            <Shield size={18} className="text-[#4318FF]" fill="currentColor" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#2B3674] truncate">Administrator</p>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#4318FF]/10 text-[#4318FF] tracking-wide">
              ADMIN
            </span>
          </div>
        </div>

        {/* Laporkan Bug */}
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${WA_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="group flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 border border-green-100"
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
            <Info size={16} className="text-green-600" />
          </div>
          <span className="text-sm tracking-wide">Laporkan Bug</span>
        </a>
      </div>
    </div>
  );
};

export default SidebarAdmin;
