import { useState, useRef } from "react";
import { updateProfile } from "../../utils/api/user";
import { useUser } from "../../utils/hooks/userContext";
import { X, Camera, Loader2, User, Mail, Phone } from "lucide-react";
import axios from "axios";
import { useToast } from "../../utils/hooks/useToast";
import { motion as Motion } from "motion/react";

const FormUpdateUser = ({ showForm, setShowForm }) => {
  const { updateUserData, userData } = useUser();
  const { showToast } = useToast();
  const user = userData || JSON.parse(localStorage.getItem("user") || "null") || {};
  const token = localStorage.getItem("tokenKey");
  const {
    email,
    phone,
    username,
    id,
    full_name,
    nim,
    role,
    url_photo: initialUrl,
  } = user;

  const [usernameInput, setUsername] = useState(username);
  const [emailInput, setEmail] = useState(email);
  const [phoneInput, setPhone] = useState(phone);
  const [urlPhoto, setUrlPhoto] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users-photo/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status === "success" && response.data.url) {
        setUrlPhoto(response.data.url);
        const updatedUser = { ...user, url_photo: response.data.url };
        updateUserData(updatedUser);
      }
    } catch (error) {
      showToast("Gagal mengunggah foto", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
    const newUpdateUser = {
      email: emailInput,
      username: usernameInput,
      id,
      full_name,
      nim,
      phone: phoneInput,
      url_photo: urlPhoto,
      role,
    };
    await updateProfile(
      {
        username: usernameInput,
        email: emailInput,
        phone: phoneInput,
        url_photo: urlPhoto,
        full_name,
      },
      updateUserData,
      newUpdateUser,
      setShowForm,
      showForm,
    );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-[20px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] px-6 py-4 flex items-center justify-between">
          <span className="text-white font-bold text-lg">Edit Profil</span>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="text-white hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmitHandler} className="px-6 py-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <img
                src={urlPhoto || "/avatar.png"}
                alt="foto profil"
                className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-100"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-[#2B3674]">{user.full_name || 'Pengguna'}</p>
              <p className="text-xs text-[#718096] mt-0.5">Klik foto untuk ganti</p>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B3674] ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="username"
                value={usernameInput}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B3674] ml-1">Nomor Telepon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={phoneInput}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nomor Telepon"
                className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B3674] ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={emailInput}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-11 pl-10 pr-4 bg-[#F4F7FE] border-0 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full h-12 bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] hover:opacity-90 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Simpan Perubahan'}
          </button>
        </form>
      </Motion.div>
    </div>
  );
};

export default FormUpdateUser;
