import { useState } from "react";
import {
  User as UserIcon,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useToast } from "../../utils/hooks/useToast";
import { forgotPasswordFlow } from "../../utils/action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { motion as Motion } from "motion/react";

const ForgotPassword = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      showToast("Username wajib diisi", "error");
      return;
    }

    setIsLoading(true);
    const result = await forgotPasswordFlow(username, setIsLoading);

    if (result.status === "error") {
      showToast(result.message, "error");
    } else {
      showToast(result.message, "success");
      // Optional: Redirect to login after success
      // setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white overflow-x-hidden flex flex-col font-jakarta">
      {/* Top Left Header Logo */}
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-50">
        <div className="max-w-[1440px] mx-auto">
          <Link to="/login">
            <img
              src="/sttimage.png"
              alt="Logo STT"
              className="h-10 md:h-12 w-auto drop-shadow-sm"
            />
          </Link>
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
              Lupa <br />
              <span className="text-[#4318FF]">Password?</span>
            </h1>
            <p className="text-[#A3AED0] text-lg md:text-2xl font-semibold mb-10 leading-relaxed max-w-[450px]">
              Jangan khawatir! Sistem akan mengirimkan link reset ke WhatsApp Anda.
            </p>
            
            <div className="flex flex-col gap-1 mb-12">
              <Link to="/login" className="text-[#4318FF] font-bold text-xl hover:underline flex items-center gap-2">
                <ArrowLeft size={20} /> Kembali ke Login
              </Link>
            </div>

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

        {/* Right Section - Forgot Password Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[480px] bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(67,24,255,0.06)] border border-gray-50 md:my-10"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#2B3674] mb-3">Recover Access</h2>
              <p className="text-[#A3AED0] font-medium">Enter your username to receive a password reset link on WhatsApp.</p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-[#2B3674] ml-1">Username</Label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-14 pl-12 rounded-2xl bg-[#F4F7FE] border-none placeholder:text-[#A3AED0] focus:ring-2 focus:ring-[#4318FF]/20 transition-all font-medium text-base"
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
                      <span>Sending link...</span>
                    </div>
                  ) : (
                    "Kirim Link ke WhatsApp"
                  )}
                </Button>
              </div>

              <div className="flex justify-center mt-8 md:hidden">
                <Link to="/login" className="text-sm font-bold text-[#4318FF] hover:underline flex items-center gap-1">
                  <ArrowLeft size={16} /> Kembali ke Login
                </Link>
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

export default ForgotPassword;
