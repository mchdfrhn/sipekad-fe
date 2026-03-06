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
    <div className="flex min-h-screen w-full overflow-hidden bg-[#F4F7FE]">
      {/* Left Side - Form Section */}
      <div className="flex w-full flex-col justify-center items-center px-6 md:w-[50%] lg:px-12 py-12">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[500px] bg-white p-8 md:p-12 rounded-[30px] shadow-xl shadow-blue-900/5"
        >
          {/* Header / Title */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#2B3674] mb-2 tracking-tight">
              Register
            </h1>
            <p className="text-gray-400 text-sm">
              Create your account to access the system
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            {/* NIM Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nim" className="text-sm font-bold text-[#2B3674] ml-1">
                NIM<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors">
                  <UserIcon size={18} />
                </div>
                <Input
                  id="nim"
                  onChange={handleChange}
                  value={formData.nim}
                  type="text"
                  placeholder="Nomor Induk Mahasiswa"
                  className="pl-12 pr-6 h-11 rounded-2xl border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[#4318FF] focus:ring-0 transition-all font-medium"
                />
              </div>
            </div>

            {/* Full Name Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name" className="text-sm font-bold text-[#2B3674] ml-1">
                Nama Lengkap<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors">
                  <UserIcon size={18} />
                </div>
                <Input
                  id="full_name"
                  onChange={handleChange}
                  value={formData.full_name}
                  type="text"
                  placeholder="NAMA LENGKAP"
                  className="pl-12 pr-6 h-11 rounded-2xl border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[#4318FF] focus:ring-0 transition-all font-medium"
                />
              </div>
            </div>

            {/* NIK Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nik" className="text-sm font-bold text-[#2B3674] ml-1">
                NIK (Sebagai Password)<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  id="nik"
                  onChange={handleChange}
                  value={formData.nik}
                  type={hiddenPassword ? "text" : "password"}
                  placeholder="Nomor Induk Kependudukan"
                  className="pl-12 pr-12 h-11 rounded-2xl border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[#4318FF] focus:ring-0 transition-all font-medium"
                />
                <div
                  onClick={() => setHiddenPassword(!hiddenPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {hiddenPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-bold text-[#2B3674] ml-1">
                Email<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  placeholder="example@mail.com"
                  className="pl-12 pr-6 h-11 rounded-2xl border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[#4318FF] focus:ring-0 transition-all font-medium"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-sm font-bold text-[#2B3674] ml-1">
                Nomor HP<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors">
                  <Phone size={18} />
                </div>
                <Input
                  id="phone"
                  onChange={handleChange}
                  value={formData.phone}
                  type="text"
                  placeholder="08123456789"
                  className="pl-12 pr-6 h-11 rounded-2xl border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[#4318FF] focus:ring-0 transition-all font-medium"
                />
              </div>
            </div>

            {/* Prodi Select */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prodi" className="text-sm font-bold text-[#2B3674] ml-1">
                Program Studi<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-[#4318FF] transition-colors pointer-events-none">
                  <Briefcase size={18} />
                </div>
                <CustomSelect
                  value={formData.prodi}
                  onChange={handleProdiChange}
                  options={Object.values(STUDENT_PRODI).map((prodi) => ({
                    label: prodi,
                    value: prodi,
                  }))}
                  placeholder="Pilih Program Studi"
                  className="pl-8"
                />
              </div>
            </div>

            {/* Register Button */}
            <Button
              className="w-full h-11 text-sm font-bold rounded-2xl bg-[#4318FF] hover:bg-[#3311db] shadow-lg shadow-blue-700/20 active:scale-[0.98] transition-all mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin h-5 w-5" />
                  <span>Registering...</span>
                </div>
              ) : (
                "Register"
              )}
            </Button>
            
            <div className="flex justify-center mt-2">
              <p className="text-xs text-gray-400 font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-[#4318FF] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </Motion.div>
      </div>

      {/* Right Side - Premium Visuals */}
      <div className="relative hidden w-[50%] overflow-hidden md:flex flex-col items-center justify-center rounded-bl-[120px] shadow-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/login-bg-3d.png"
            alt="Background"
            className="h-full w-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-br from-[#4318FF]/80 to-[#707EFE]/40 backdrop-blur-[2px]"></div>
        </div>

        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center px-12 text-center"
        >
          {/* Logo Container */}
          <Motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 bg-white/20 p-5 rounded-[40px] backdrop-blur-2xl border border-white/30 shadow-2xl"
          >
            <img
              src="/sttimage.png"
              alt="Logo STT"
              className="h-24 w-auto drop-shadow-2xl"
            />
          </Motion.div>

          <Motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className="text-6xl font-black text-white tracking-tighter mb-1 drop-shadow-md">
              SIPEKAD
            </h1>
            <p className="text-white/90 text-xl font-medium tracking-wide mb-12">
              Sistem Pengajuan Akademik
            </p>
          </Motion.div>

          {/* Statistics or Info in Register Page */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-[500px] mb-12">
            {[
              {
                icon: <Files size={20} />,
                title: "Easy Step",
                desc: "Quick registration",
              },
              {
                icon: <Lock size={20} />,
                title: "Safe Data",
                desc: "Privacy protected",
              },
            ].map((feature, idx) => (
              <Motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-left hover:bg-white/20 transition-all cursor-default"
              >
                <div className="bg-white/20 p-2 rounded-xl text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 text-[10px]">{feature.desc}</p>
                </div>
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default Register;
