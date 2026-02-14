import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Lock,
  Mail,
  Phone,
  Hash,
  Settings as SettingsIcon,
} from "lucide-react";
import { useUser } from "@/utils/hooks/userContext";
import { useToast } from "@/utils/hooks/useToast";
import { updateProfile, changePassword } from "@/utils/api/user";
import { USER_ROLE } from "@/utils/constant";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UploadWidget from "@/components/ui/UploadWidget";

const Settings = () => {
  const { userData, updateUserData } = useUser();
  const { showToast } = useToast();
  const token = localStorage.getItem("tokenKey");
  const navigate = useNavigate();

  // Profile State - Include all fields (even hidden ones) for backend validation
  const [profileData, setProfileData] = useState({
    username: userData?.username || "",
    full_name: userData?.full_name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    url_photo: userData?.url_photo || "",
    nim: userData?.nim || "",
    nik: userData?.nik || "",
    prodi: userData?.prodi || "",
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = useCallback((url) => {
    setProfileData((p) => ({ ...p, url_photo: url }));
  }, []);

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      // Create the updated user object before calling updateProfile
      const updatedUser = { ...userData, ...profileData };

      const result = await updateProfile(
        profileData,
        updateUserData,
        updatedUser,
        null,
        null,
      );

      if (result && (result.status === "success" || result.userId)) {
        showToast("Profil berhasil diperbarui", "success");

        // Wait for Toast and Redirect
        setTimeout(() => {
          // Safety check for role and constant
          const isAdmin =
            userData?.role === "admin" ||
            userData?.role === USER_ROLE?.USER_ADMIN;
          const redirectPath = isAdmin ? "/admin" : "/dashboard";
          navigate(redirectPath);
        }, 1500);
      } else {
        // Handle complex error messages from Zod/Backend
        let errorMessage = "Gagal memperbarui profil";
        if (result?.message) {
          if (typeof result.message === "object") {
            // If it's a Zod error object, pick the first error
            const firstError = Object.values(result.message)[0];
            errorMessage = Array.isArray(firstError)
              ? firstError[0]
              : String(firstError);
          } else {
            errorMessage = String(result.message);
          }
        }
        showToast(errorMessage, "error");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onUpdatePassword = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      return showToast("Konfirmasi password tidak cocok", "error");
    }

    setIsUpdatingPassword(true);
    try {
      const result = await changePassword(token, {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });

      if (result && result.status === "success") {
        showToast("Password berhasil diperbarui", "success");
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast(result?.message || "Gagal memperbarui password", "error");
      }
    } catch (error) {
      console.error("Update password error:", error);
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!userData) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-[#4318FF]" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpdateProfile} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner bg-gray-100 flex items-center justify-center">
                    <img
                      src={profileData.url_photo || "/avatar.png"}
                      alt="Avatar"
                      className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <UploadWidget setPublicId={handleAvatarUpload} />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Username
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="username"
                        value={profileData.username}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl outline-none text-sm font-medium cursor-not-allowed"
                        placeholder="Username"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="full_name"
                        value={profileData.full_name}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  className="rounded-xl px-8 h-11 font-bold shadow-lg shadow-indigo-500/30"
                  disabled={isUpdatingProfile}
                  type="submit"
                >
                  {isUpdatingProfile ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white h-fit border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#4318FF]" />
              Security
            </CardTitle>
            <CardDescription>Change your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-[#2B3674] ml-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="currentPassword"
                    type="password"
                    value={securityData.currentPassword}
                    onChange={handleSecurityChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                    placeholder="Current Password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-[#2B3674] ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="newPassword"
                    type="password"
                    value={securityData.newPassword}
                    onChange={handleSecurityChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                    placeholder="New Password"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-[#2B3674] ml-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={handleSecurityChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 rounded-xl border-indigo-100 text-[#4318FF] hover:bg-indigo-50 font-bold"
                disabled={isUpdatingPassword}
                type="submit"
              >
                {isUpdatingPassword ? "Processing..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
