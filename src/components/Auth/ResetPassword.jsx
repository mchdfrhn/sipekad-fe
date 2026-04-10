import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { useToast } from "../../utils/hooks/useToast";
import { resetPasswordFlow } from "../../utils/action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { motion as Motion } from "motion/react";

const ResetPassword = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      showToast("Token tidak ditemukan. Silakan minta link reset baru.", "error");
      return;
    }

    if (!password || !confirmPassword) {
      showToast("Semua field wajib diisi", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Konfirmasi password tidak cocok", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password minimal 6 karakter", "error");
      return;
    }

    setIsLoading(true);
    const result = await resetPasswordFlow({ token, newPassword: password }, navigate, setIsLoading);

    if (result.status === "error") {
      showToast(result.message, "error");
    } else {
      showToast(result.message, "success");
      setIsSuccess(true);
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
              Atur Ulang <br />
              <span className="text-[#4318FF]">Password</span>
            </h1>
            <p className="text-[#A3AED0] text-lg md:text-2xl font-semibold mb-10 leading-relaxed max-w-[450px]">
              Silakan masukkan kata sandi baru Anda untuk mengamankan akun SIPEKAD.
            </p>
            
            {/* Playful 3D Character Illustration */}
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
            </div>
          </Motion.div>
        </div>

        {/* Right Section - Reset Password Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[480px] bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(67,24,255,0.06)] border border-gray-50 md:my-10"
          >
            {isSuccess ? (
              <div className="text-center py-8">
                <Motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center mb-6"
                >
                  <CheckCircle size={80} className="text-green-500" />
                </Motion.div>
                <h2 className="text-3xl font-bold text-[#2B3674] mb-3">Berhasil!</h2>
                <p className="text-[#A3AED0] font-medium mb-8">Password Anda telah berhasil diperbarui. Mengalihkan ke halaman login...</p>
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full h-14 bg-[#4318FF] hover:bg-[#3311db] text-white rounded-2xl text-lg font-bold"
                >
                  Ke Halaman Login
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-[#2B3674] mb-3">Reset Password</h2>
                  <p className="text-[#A3AED0] font-medium">Create a new secure password for your account.</p>
                </div>

                {!token ? (
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6">
                    <p className="text-red-600 text-sm font-semibold">Tautan tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru dari halaman login.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmitHandler} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-[#2B3674] ml-1">Password Baru</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                        <Input
                          type={hiddenPassword ? "text" : "password"}
                          placeholder="Minimal 6 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-14 pl-12 pr-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all font-medium text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setHiddenPassword(!hiddenPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors text-[#A3AED0]"
                        >
                          {hiddenPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-[#2B3674] ml-1">Konfirmasi Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                        <Input
                          type={hiddenPassword ? "text" : "password"}
                          placeholder="Masukkan ulang password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-14 pl-12 pr-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all font-medium text-base"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        disabled={isLoading}
                        className="w-full h-14 bg-[#4318FF] hover:bg-[#3311db] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#4318FF]/25 active:scale-[0.98] transition-all"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <LoaderCircle className="animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          "Perbarui Password"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )}
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

export default ResetPassword;
