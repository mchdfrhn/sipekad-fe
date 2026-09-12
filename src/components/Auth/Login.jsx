import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  User as UserIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router";
import { useUser } from "../../utils/hooks/userContext";
import { useToast } from "../../utils/hooks/useToast";
import { loginFlow } from "../../utils/action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { motion as Motion } from "motion/react";

const Login = () => {
  const { updateUserData } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [registerNotice, setRegisterNotice] = useState(
    location.state?.registered
      ? location.state?.message ||
          "Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan admin sebelum dapat digunakan untuk login."
      : ""
  );
  const [pendingNotice, setPendingNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (location.state?.registered) {
      showToast(
        location.state?.message ||
          "Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan admin.",
        "info"
      );
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToast]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!username.trim() || !password.trim()) {
      showToast("Username dan password wajib diisi", "error");
      return;
    }

    setPendingNotice("");
    setErrorMessage("");
    setIsLoading(true);
    const data = { username, password };

    const result = await loginFlow(
      data,
      updateUserData,
      navigate,
      setIsLoading,
    );

    if (result && result.status === "error") {
      const isAccountPending =
        result.code === "ACCOUNT_PENDING" ||
        (result.message &&
          (result.message.toLowerCase().includes("menunggu persetujuan") ||
            result.message.toLowerCase().includes("belum disetujui") ||
            result.message.toLowerCase().includes("pending")));

      if (isAccountPending) {
        const msg =
          result.message ||
          "Akun Anda sedang menunggu persetujuan admin. Harap tunggu hingga admin menyetujui akun Anda sebelum masuk.";
        setPendingNotice(msg);
        showToast(msg, "warning", 6000);
      } else {
        setErrorMessage(result.message || "Email atau password salah");
        showToast(result.message || "Email atau password salah", "error", 4000);
      }
    } else if (result && result.status === "success") {
      showToast("Login berhasil! Mengalihkan...", "success");
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
      <main className="flex-1 max-w-[1440px] mx-auto w-full flex flex-col md:flex-row items-center justify-center px-6 py-20 md:py-0 gap-16 md:gap-0">
        
        {/* Left Section - Typography & Visuals (Hidden on Mobile) */}
        <div className="hidden md:flex w-1/2 flex-col justify-center items-start pl-20">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[600px]"
          >
            <h1 className="text-[54px] md:text-[72px] font-black text-[#2B3674] leading-tight tracking-tighter mb-6">
              Masuk ke <br />
              <span className="text-[#4318FF]">SIPEKAD</span>
            </h1>
            <p className="text-[#718096] text-lg md:text-2xl font-semibold mb-10 leading-relaxed max-w-[450px]">
              Sistem Pengajuan Akademik. Masuk untuk melanjutkan pengajuan Anda.
            </p>
            
            <div className="mb-12" />

            {/* Playful 3D Character Illustration below text */}
            <div className="relative w-full max-w-[400px] md:max-w-[500px]">
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
                  className="w-full h-auto drop-shadow-[var(--shadow-brand-lg)]"
                />
              </Motion.div>
              
              {/* Floating Academic Cap */}
              <Motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 15, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-0 -right-4 w-32 md:w-44 z-20"
              >
                <img src="/assets/3d-cap.png" alt="Cap" loading="lazy" className="w-full h-auto drop-shadow-2xl" />
              </Motion.div>
            </div>
          </Motion.div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[480px] bg-white rounded-[20px] p-8 md:p-12 shadow-[var(--shadow-brand-lg)] border border-indigo-50"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#2B3674] mb-2">Masuk</h2>
              <p className="text-[#718096] font-medium">Masukkan kredensial Anda untuk melanjutkan</p>
            </div>

            {/* Keterangan Akun Belum Disetujui Admin */}
            {pendingNotice && (
              <Motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-sm flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <h4 className="text-sm font-bold text-amber-900">
                      Akun Belum Disetujui Admin
                    </h4>
                  </div>
                  <p className="text-xs text-amber-800 mt-1.5 leading-relaxed font-medium">
                    {pendingNotice}
                  </p>
                  <p className="text-[11px] text-amber-700/90 mt-2.5 pt-2 border-t border-amber-200/80 leading-relaxed">
                    💡 <span className="font-semibold">Informasi:</span> Akun Anda telah terdaftar namun masih memerlukan verifikasi & persetujuan dari administrator akademik sebelum dapat digunakan untuk masuk ke SIPEKAD.
                  </p>
                </div>
              </Motion.div>
            )}

            {/* Keterangan Pendaftaran Berhasil (Pengalihan dari Register) */}
            {registerNotice && !pendingNotice && (
              <Motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm flex items-start gap-3.5"
              >
                <div className="p-2 rounded-xl bg-blue-100 text-[#4318FF] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-bold text-[#2B3674]">
                    Pendaftaran Berhasil!
                  </h4>
                  <p className="text-xs text-[#718096] mt-1 leading-relaxed font-medium">
                    {registerNotice}
                  </p>
                </div>
              </Motion.div>
            )}

            {/* Error Message Umum */}
            {errorMessage && !pendingNotice && (
              <Motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 shadow-sm flex items-start gap-3"
              >
                <div className="p-1.5 rounded-xl bg-red-100 text-red-600 shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs text-red-700 font-semibold leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              </Motion.div>
            )}

            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-[#2B3674] ml-1">Username / Email</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#718096] group-focus-within:text-[#4318FF] transition-colors" />
                  <Input
                    type="text"
                    placeholder="Masukkan email atau username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="h-14 pl-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#718096] focus:ring-2 focus:ring-[#4318FF]/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-sm font-bold text-[#2B3674]">Password</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#718096] group-focus-within:text-[#4318FF] transition-colors" />
                  <Input
                    type={hiddenPassword ? "text" : "password"}
                    placeholder="Kata sandi"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    className="h-14 pl-12 pr-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#718096] focus:ring-2 focus:ring-[#4318FF]/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setHiddenPassword(!hiddenPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors text-[#718096]"
                  >
                    {hiddenPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="flex justify-end pr-1 mt-1">
                  <Link to="/forgot-password" disabled={isLoading} className="text-sm font-semibold text-[#4318FF] hover:underline">Lupa kata sandi?</Link>
                </div>
              </div>

              <Button
                disabled={isLoading}
                className="w-full h-14 bg-[#4318FF] hover:bg-[#3311db] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[var(--shadow-brand-sm)]/25 active:scale-[0.98] transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Masuk"
                )}
              </Button>
              
             <div className="flex justify-center mt-8">
                <p className="text-sm font-medium text-gray-500">
                  Belum memiliki akun?{" "}
                  <Link to="/register" className="text-[#4318FF] font-black hover:underline">
                    Daftar di sini!
                  </Link>
                </p>
              </div>
            </form>
          </Motion.div>
        </div>
      </main>

      {/* Background Decorative Blobs (Subtle) */}
      <Motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="fixed -top-40 -right-40 w-96 h-96 bg-[#4318FF]/5 rounded-full blur-3xl -z-1"
      />
      <Motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="fixed -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-1"
      />
    </div>
  );
};


export default Login;
