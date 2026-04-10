import { useState } from "react";
import {
  Briefcase,
  Eye,
  EyeOff,
  Files,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useToast } from "../../utils/hooks/useToast";
import { registerFlow } from "../../utils/action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import CustomSelect from "../ui/CustomSelect";
import { motion as Motion } from "motion/react";
import { STUDENT_PRODI } from "../../utils/constant";

const Register = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nim: "",
    full_name: "",
    nik: "",
    email: "",
    phone: "",
    prodi: "",
  });
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "full_name" ? value.toUpperCase() : value,
    }));
  };

  const handleProdiChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      prodi: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic Validation
    const { nim, full_name, nik, email, phone, prodi } = formData;
    if (!nim || !full_name || !nik || !email || !phone || !prodi) {
      showToast("Semua field wajib diisi", "error");
      return;
    }

    setIsLoading(true);
    const result = await registerFlow(formData, navigate, setIsLoading);

    if (result && result.status === "error") {
      showToast(result.message, "error");
    } else if (result && result.status === "success") {
      showToast("Registrasi berhasil! Silakan login.", "success");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-x-hidden flex flex-col font-jakarta">
      {/* Top Left Header Logo */}
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-50">
        <div className="max-w-[1440px] mx-auto">
          <img
            src="/sttimage.png"
            alt="Logo STT"
            className="h-10 md:h-12 w-auto drop-shadow-sm"
          />
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex flex-col md:flex-row items-center justify-center px-6 pt-16 pb-10 md:py-0 gap-16 md:gap-0">
        
        {/* Left Section - Typography & Visuals (Hidden on Mobile) */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-start pl-20">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[600px]"
          >
            <h1 className="text-[54px] md:text-[72px] font-black text-[#2B3674] leading-[1] tracking-tighter mb-6">
              Daftar Akun <br />
              <span className="text-[#4318FF]">SIPEKAD</span>
            </h1>
            <p className="text-[#A3AED0] text-lg md:text-2xl font-semibold mb-10 leading-relaxed max-w-[450px]">
              Sistem Pengajuan Akademik. Silakan lengkapi data diri Anda untuk memulai.
            </p>
            
            <div className="flex flex-col gap-1 mb-12">
              <p className="text-gray-500 font-medium">Sudah memiliki akun?</p>
              <Link to="/login" className="text-[#4318FF] font-bold text-xl hover:underline">
                Masuk di sini!
              </Link>
            </div>

            {/* Playful 3D Character Illustration below text */}
            <div className="relative w-full max-w-[320px] md:max-w-[440px]">
              <Motion.div
                animate={{
                  y: [0, -25, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full"
              >
                <img
                  src="/assets/3d-student.png"
                  alt="Student Animation"
                  className="w-full h-auto drop-shadow-[0_45px_45px_rgba(67,24,255,0.12)]"
                />
              </Motion.div>
              
              {/* Floating Academic Cap */}
              <Motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 15, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-0 -right-4 w-28 md:w-40 z-20"
              >
                <img src="/assets/3d-cap.png" alt="Cap" className="w-full h-auto drop-shadow-2xl" />
              </Motion.div>
            </div>
          </Motion.div>
        </div>

        {/* Right Section - Register Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[540px] bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(67,24,255,0.06)] border border-gray-50 md:my-10"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#2B3674] mb-2 tracking-tight">Create Account</h2>
              <p className="text-[#A3AED0] font-medium text-sm">Fill in your information to register</p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#2B3674] ml-1">NIM *</Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                    <Input
                      id="nim"
                      type="text"
                      placeholder="NIM"
                      value={formData.nim}
                      onChange={handleChange}
                      className="h-12 pl-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#2B3674] ml-1">Nama Lengkap *</Label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Nama Lengkap"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="h-12 pl-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#2B3674] ml-1">NIK (Digunakan sebagai Password) *</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                  <Input
                    id="nik"
                    type={hiddenPassword ? "text" : "password"}
                    placeholder="Masukkan NIK"
                    value={formData.nik}
                    onChange={handleChange}
                    className="h-12 pl-12 pr-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setHiddenPassword(!hiddenPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors text-[#A3AED0]"
                  >
                    {hiddenPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#2B3674] ml-1">Email *</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 pl-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[#2B3674] ml-1">Nomor HP *</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                    <Input
                      id="phone"
                      type="text"
                      placeholder="08..."
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-12 pl-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#2B3674] ml-1">Program Studi *</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors z-10 pointer-events-none">
                    <Briefcase size={16} />
                  </div>
                  <CustomSelect
                    value={formData.prodi}
                    onChange={handleProdiChange}
                    options={Object.values(STUDENT_PRODI).map((prodi) => ({
                      label: prodi,
                      value: prodi,
                    }))}
                    placeholder="Pilih Program Studi"
                    className="h-12 pl-8 rounded-2xl bg-[#F4F7FE] border-none focus:ring-2 focus:ring-[#4318FF]/20 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  disabled={isLoading}
                  className="w-full h-12 bg-[#4318FF] hover:bg-[#3311db] text-white rounded-2xl text-base font-bold shadow-xl shadow-[#4318FF]/25 active:scale-[0.98] transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LoaderCircle className="animate-spin" />
                      <span>Registering...</span>
                    </div>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </Button>
              </div>

              <div className="flex justify-center mt-6">
                <p className="text-sm font-medium text-gray-500">
                  Sudah memiliki akun?{" "}
                  <Link to="/login" className="text-[#4318FF] font-black hover:underline">
                    Masuk di sini!
                  </Link>
                </p>
              </div>
            </form>
          </Motion.div>
        </div>
      </main>

      {/* Background Decorative Blobs */}
      <Motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="fixed -top-40 -left-40 w-96 h-96 bg-[#4318FF]/5 rounded-full blur-3xl -z-1"
      />
      <Motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="fixed -bottom-40 -right-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-1"
      />
    </div>
  );
};

export default Register;
