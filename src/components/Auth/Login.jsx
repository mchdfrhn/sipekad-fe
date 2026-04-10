import { useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  User as UserIcon,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useUser } from "../../utils/hooks/userContext";
import { useToast } from "../../utils/hooks/useToast";
import { loginFlow } from "../../utils/action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { motion as Motion } from "motion/react";

const Login = () => {
  const { updateUserData } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!username.trim() || !password.trim()) {
      showToast("Username dan password wajib diisi", "error");
      return;
    }

    setIsLoading(true);
    const data = { username, password };

    const result = await loginFlow(
      data,
      updateUserData,
      navigate,
      setIsLoading,
    );

    if (result && result.status === "error") {
      showToast(result.message, "error");
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
            <h1 className="text-[54px] md:text-[72px] font-black text-[#2B3674] leading-[1] tracking-tighter mb-6">
              Masuk ke <br />
              <span className="text-[#4318FF]">SIPEKAD</span>
            </h1>
            <p className="text-[#A3AED0] text-lg md:text-2xl font-semibold mb-10 leading-relaxed max-w-[450px]">
              Sistem Pengajuan Akademik. Masuk untuk melanjutkan pengajuan Anda.
            </p>
            
            <div className="flex flex-col gap-1 mb-12">
              <p className="text-gray-500 font-medium">Belum memiliki akun?</p>
              <Link to="/register" className="text-[#4318FF] font-bold text-xl hover:underline">
                Daftar sekarang di sini!
              </Link>
            </div>

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
                className="absolute top-0 -right-4 w-32 md:w-44 z-20"
              >
                <img src="/assets/3d-cap.png" alt="Cap" className="w-full h-auto drop-shadow-2xl" />
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
            className="w-full max-w-[480px] bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(67,24,255,0.06)] border border-gray-50"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-[#2B3674] mb-3">Sign In</h2>
              <p className="text-[#A3AED0] font-medium">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-[#2B3674] ml-1">Username/Email</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                  <Input
                    type="text"
                    placeholder="Enter your email or username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-14 pl-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-sm font-bold text-[#2B3674]">Password</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                  <Input
                    type={hiddenPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 pr-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setHiddenPassword(!hiddenPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors text-[#A3AED0]"
                  >
                    {hiddenPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div className="flex justify-end pr-1 mt-1">
                  <a href="#" className="text-sm font-semibold text-[#4318FF] hover:underline">Forgot password?</a>
                </div>
              </div>

              <Button
                disabled={isLoading}
                className="w-full h-14 bg-[#4318FF] hover:bg-[#3311db] text-white rounded-2xl text-lg font-bold shadow-xl shadow-[#4318FF]/25 active:scale-[0.98] transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              
              <div className="relative mt-8 mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-[#A3AED0] font-bold">or continue with (Coming Soon)</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                {/* Facebook */}
                <div className="p-3.5 rounded-2xl bg-white cursor-pointer hover:bg-gray-50 transition-all border border-gray-100 shadow-sm group">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform group-hover:scale-110" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                {/* Apple */}
                <div className="p-3.5 rounded-2xl bg-white cursor-pointer hover:bg-gray-50 transition-all border border-gray-100 shadow-sm group">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform group-hover:scale-110" fill="black">
                    <path d="M17.05 12.05c-.1-2.25 1.5-3.35 1.6-3.4-1.15-1.7-2.95-1.9-3.6-1.95-1.55-.15-3.05.9-3.85.9-.8 0-2.05-.95-3.35-.95-1.75 0-3.35 1-4.25 2.55-1.8 3.15-.45 7.75 1.3 10.3.85 1.25 1.85 2.65 3.15 2.6 1.25-.05 1.7-.8 3.25-.8 1.55 0 1.95.8 3.3.75 1.35-.05 2.25-1.3 3.1-2.5 1-1.4 1.4-2.75 1.45-2.85-.05-.05-2.8-1.05-2.8-4.3zM13.25 5.5c.7-0.85 1.15-2.05 1.05-3.25-1.05.05-2.35.7-3.1 1.6-.65.75-1.15 1.95-1.05 3.1 1.2.05 2.45-.6 3.1-1.45z" />
                  </svg>
                </div>
                {/* Google */}
                <div className="p-3.5 rounded-2xl bg-white cursor-pointer hover:bg-gray-50 transition-all border border-gray-100 shadow-sm group">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 transition-transform group-hover:scale-110">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
              </div>
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
