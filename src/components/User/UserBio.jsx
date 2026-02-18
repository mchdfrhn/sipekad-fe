import { Mail, Phone, Pen, Users } from "lucide-react";
import { Link } from "react-router";
import { useUser } from "../../utils/hooks/userContext";
import { Button } from "@/components/ui/button";

const UserBio = () => {
  const { userData: user } = useUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#2B3674] hidden md:block">
            User Profile
          </h2>
        </div>
        <Link to="/dashboard/settings">
          <Button className="flex items-center gap-2 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl px-6 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
            <Pen className="h-4 w-4" />
            <span>Edit Profile Settings</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden p-6 lg:p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Profile Picture */}
          <div className="relative group shrink-0">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-[6px] border-indigo-50 shadow-lg">
              {user?.url_photo ? (
                <img
                  src={user.url_photo}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F4F7FE] flex items-center justify-center">
                  <Users className="h-16 w-16 text-[#4318FF]" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Info Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12 w-full">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Nama Lengkap
              </p>
              <h3 className="text-lg md:text-xl font-bold text-[#2B3674]">
                {user.username || user.full_name || "-"}
              </h3>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Program Studi
              </p>
              <p className="text-base font-semibold text-[#2B3674]">
                {user.prodi || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                NIM/ID
              </p>
              <p className="text-base font-semibold text-[#2B3674]">
                {user.nim || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Email Address
              </p>
              <div className="flex items-center gap-2 text-base font-semibold text-[#2B3674]">
                <Mail className="h-4 w-4 text-gray-400" />
                {user.email || "-"}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Phone Number
              </p>
              <div className="flex items-center gap-2 text-base font-semibold text-[#2B3674]">
                <Phone className="h-4 w-4 text-gray-400" />
                {user.phone || "-"}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                NIK
              </p>
              <p className="text-base font-semibold text-[#2B3674]">
                {user.nik || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Role
              </p>
              <p className="text-base font-semibold text-[#2B3674] capitalize">
                {user.role || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
