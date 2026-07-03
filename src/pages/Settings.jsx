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
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion as Motion } from "motion/react";
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
  const isAdmin = userData?.role === "admin";

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

  // Password visibility state
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

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
            // silent — deletion failure shouldn't interrupt user flow
          }
        }
      }
    } catch (error) {
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
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!userData) return null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-10 pt-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-2xl bg-[#4318FF]/10 flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-[#4318FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2B3674] leading-tight">Pengaturan Akun</h1>
              <p className="text-sm text-[#718096]">Kelola informasi profil dan keamanan akun Anda</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 flex flex-col">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4318FF] bg-indigo-50 px-3 py-1 rounded-full mb-3 self-start">
              01 — Profil
            </span>
            <Card className="rounded-[20px] border-gray-100/80 shadow-[0_4px_24px_rgba(67,24,255,0.06)] bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-[#4318FF]" />
                  Informasi Profil
                </CardTitle>
                <CardDescription>
                  Perbarui detail profil Anda di sini.
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
                      <div className="absolute inset-0 rounded-full bg-[#4318FF]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center border-2 border-white/20">
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
                            className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl outline-none text-sm font-medium cursor-not-allowed focus:ring-2 focus:ring-[#4318FF]/20"
                            placeholder="Username"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#2B3674] ml-1">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleProfileChange}
                            className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#4318FF]/20 transition-all outline-none text-sm font-medium"
                            placeholder="Nama Lengkap"
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
                            className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#4318FF]/20 transition-all outline-none text-sm font-medium"
                            placeholder="Alamat Email"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-[#2B3674] ml-1">
                          Nomor Telepon
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#4318FF]/20 transition-all outline-none text-sm font-medium"
                            placeholder="Nomor Telepon"
                          />
                        </div>
                      </div>
                      {!isAdmin && (
                        <>
                          <div className="space-y-1">
                            <label className="text-sm font-bold text-[#2B3674] ml-1">
                              Program Studi
                            </label>
                            <div className="relative">
                              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                name="prodi"
                                value={profileData.prodi}
                                className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl outline-none text-sm font-medium cursor-not-allowed focus:ring-2 focus:ring-[#4318FF]/20"
                                placeholder="Program Studi"
                                disabled
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
                                className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl outline-none text-sm font-medium cursor-not-allowed focus:ring-2 focus:ring-[#4318FF]/20"
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
                                className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#4318FF]/20 transition-all outline-none text-sm font-medium"
                                placeholder="NIK"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      className="w-full h-12 bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] hover:opacity-90 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                      disabled={isUpdatingProfile}
                      type="submit"
                    >
                      {isUpdatingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Security */}
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4318FF] bg-indigo-50 px-3 py-1 rounded-full mb-3 self-start">
              02 — Keamanan
            </span>
            <Card className="rounded-[20px] border-gray-100/80 shadow-[0_4px_24px_rgba(67,24,255,0.06)] bg-white h-fit">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#4318FF]" />
                  Keamanan
                </CardTitle>
                <CardDescription>Ubah kata sandi Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onUpdatePassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="currentPassword"
                        type={showCurrentPw ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full h-11 pl-10 pr-10 bg-[#F4F7FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#4318FF]/20 transition-all outline-none text-sm font-medium"
                        placeholder="Password Saat Ini"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="newPassword"
                        type={showNewPw ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full h-11 pl-10 pr-10 bg-[#F4F7FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#4318FF]/20 transition-all outline-none text-sm font-medium"
                        placeholder="Password Baru"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-[#2B3674] ml-1">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        name="confirmPassword"
                        type={showConfirmPw ? "text" : "password"}
                        value={securityData.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full h-11 pl-10 pr-10 bg-[#F4F7FE] border-0 rounded-2xl focus:ring-2 focus:ring-[#4318FF]/20 transition-all outline-none text-sm font-medium"
                        placeholder="Konfirmasi Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    className="w-full h-12 bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] hover:opacity-90 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all mt-4"
                    disabled={isUpdatingPassword}
                    type="submit"
                  >
                    {isUpdatingPassword ? "Memproses..." : "Perbarui Password"}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Photo Editor Modal */}
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-[20px]">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-xl font-bold text-[#2B3674] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#4318FF]" />
                Atur Foto Profil
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
                    <span>Tingkat Zoom</span>
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
                  Batal
                </Button>
                <Button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={isUploadingPhoto}
                  className="flex-2 rounded-xl bg-[#4318FF] hover:bg-[#3311CC] text-white font-bold h-11 shadow-lg shadow-indigo-500/20"
                >
                  {isUploadingPhoto ? (
                    "Mengunggah..."
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Simpan Foto
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Motion.div>
  );
};

export default Settings;
