import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Lock,
  Mail,
  Phone,
  Hash,
  Camera,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sliders, ZoomIn, Check, X } from "lucide-react";
import axios from "axios";

const Settings = () => {
  const { userData, updateUserData } = useUser();
  const { showToast } = useToast();
  const token = localStorage.getItem("tokenKey");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

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
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setProfileData({
        username: userData.username || "",
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        url_photo: userData.url_photo || "",
        nim: userData.nim || "",
        nik: userData.nik || "",
        prodi: userData.prodi || "",
      });
    }
  }, [userData]);

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

  // Photo Editor State
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const onCropComplete = useCallback((_setCroppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage(reader.result);
        setIsEditorOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        // Enforce 512x512 size for better performance and storage
        const targetSize = 512;
        canvas.width = targetSize;
        canvas.height = targetSize;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          targetSize,
          targetSize,
        );

        // Use quality 0.8 for good balance between size and quality
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas is empty"));
            resolve(blob);
          },
          "image/jpeg",
          0.8,
        );
      };
      image.onerror = (e) => reject(e);
    });
  };

  const handleUploadPhoto = async () => {
    try {
      setIsUploadingPhoto(true);
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedImageBlob);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users-photo/${userData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status === "success" && response.data.url) {
        const newUrl = response.data.url;
        const oldPhotoUrl = profileData.url_photo;
        handleAvatarUpload(newUrl);

        // Update local user data state
        const updatedUser = { ...userData, url_photo: newUrl };
        updateUserData(updatedUser);

        setIsEditorOpen(false);
        showToast("Foto profil berhasil diperbarui", "success");

        if (
          oldPhotoUrl &&
          (oldPhotoUrl.includes("cloudinary.com") ||
            oldPhotoUrl.includes("amazonaws.com"))
        ) {
          try {
            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/storage/delete`,
              {
                headers: { Authorization: `Bearer ${token}` },
                data: { url: oldPhotoUrl },
              },
            );
          } catch (deleteError) {
            console.error("Failed to delete old photo:", deleteError);
            // Silent fail for deletion to not interrupt user flow
          }
        }
      }
    } catch (error) {
      console.error("Upload photo error:", error);
      showToast("Gagal mengunggah foto", "error");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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
                <div
                  className="relative group cursor-pointer w-32 h-32"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar className="w-full h-full border-4 border-[#F4F7FE] shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-indigo-100">
                    <AvatarImage
                      src={profileData.url_photo}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <AvatarFallback className="bg-blue-100 text-[#4318FF] font-bold text-2xl">
                      {getInitials(profileData.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Professional Overlay */}
                  <div className="absolute inset-0 rounded-full bg-[#11047A]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center border-2 border-white/20">
                    <div className="bg-white/20 p-2 rounded-full mb-1">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Ganti Foto
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
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
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Program Studi
                    </label>
                    <div className="relative">
                      <SettingsIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="prodi"
                        value={profileData.prodi}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                        placeholder="Program Studi"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      NIM/ID
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="nim"
                        value={profileData.nim}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl outline-none text-sm font-medium cursor-not-allowed"
                        placeholder="NIM/ID"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      NIK
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="nik"
                        value={profileData.nik}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium"
                        placeholder="NIK"
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

      {/* Photo Editor Modal */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold text-[#2B3674] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#4318FF]" />
              Adjust Profile Photo
            </DialogTitle>
          </DialogHeader>

          <div className="relative h-80 w-full bg-gray-50">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-[#2B3674]">
                <div className="flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  <span>Zoom Level</span>
                </div>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#4318FF]"
              />
            </div>

            <DialogFooter className="flex gap-3 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditorOpen(false)}
                className="flex-1 rounded-xl border-gray-100 text-gray-500 font-bold h-11"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUploadPhoto}
                disabled={isUploadingPhoto}
                className="flex-2 rounded-xl bg-[#4318FF] hover:bg-[#3311CC] text-white font-bold h-11 shadow-lg shadow-indigo-500/20"
              >
                {isUploadingPhoto ? (
                  "Uploading..."
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Photo
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
