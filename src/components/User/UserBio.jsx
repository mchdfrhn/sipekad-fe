import { useState } from "react";
import { Mail, Phone, Pen, Users, Copy } from "lucide-react";
import { Link } from "react-router";
import { useUser } from "../../utils/hooks/userContext";
import { Button } from "@/components/ui/button";

const roleBadge = (role) => {
  if (role === "admin") return "bg-purple-100 text-purple-700 border-purple-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
};

const UserBio = () => {
  const { userData: user } = useUser();
  const [nikCopied, setNikCopied] = useState(false);

  const copyNik = () => {
    navigator.clipboard.writeText(user.nik);
    setNikCopied(true);
    setTimeout(() => setNikCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* page title row */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#2B3674] hidden md:block">Profil Saya</h2>
        <Link to="/dashboard/settings">
          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] hover:opacity-90 text-white rounded-xl px-6 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
            <Pen className="h-4 w-4" />
            <span>Edit Profil</span>
          </Button>
        </Link>
      </div>

      {/* profile card */}
      <div className="premium-card overflow-hidden">
        {/* gradient banner */}
        <div className="relative h-32 bg-gradient-to-r from-[#4318FF] to-[#7C5FFF]">
          {/* decorative orbs */}
          <div className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/4 h-16 w-16 rounded-full bg-white/10 blur-xl" />

          {/* avatar overlapping banner */}
          <div className="absolute left-6 md:left-10" style={{ bottom: "-40px" }}>
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-[#F4F7FE]">
              {user?.url_photo ? (
                <img src={user.url_photo} alt={user.username} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-[#4318FF]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* info section — padded top for avatar overlap */}
        <div className="pt-14 pb-8 px-6 md:px-10">
          {/* name + role row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-[#2B3674]">
              {user.full_name || user.username || "-"}
            </h3>
            <span className={`self-start sm:self-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${roleBadge(user.role)}`}>
              {user.role || "user"}
            </span>
          </div>

          {/* info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Program Studi</p>
              <p className="text-sm font-semibold text-[#2B3674]">{user.prodi || "-"}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">NIM/ID</p>
              <p className="text-sm font-semibold text-[#2B3674]">{user.nim || "-"}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">NIK</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#2B3674]">{user.nik || "-"}</p>
                {user.nik && (
                  <button onClick={copyNik} className="text-gray-400 hover:text-[#4318FF] transition-colors" title="Salin NIK">
                    <Copy size={14} />
                  </button>
                )}
                {nikCopied && <span className="text-xs text-[#4318FF] font-medium">Disalin!</span>}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Email</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#2B3674]">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                {user.email || "-"}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">No. HP</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#2B3674]">
                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                {user.phone || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
