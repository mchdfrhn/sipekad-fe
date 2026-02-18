import { useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
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
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F7FE]">
      {/* Left Side - Form Section */}
      <div className="flex w-full flex-col justify-center items-center px-6 md:w-[50%] lg:px-12">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[450px] bg-white p-8 md:p-12 rounded-[30px] shadow-xl shadow-blue-900/5"
        >
          {/* Header / Title */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#2B3674] mb-2 tracking-tight">
              Sign In
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your username and password to access the system
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            {/* Username/Email Input */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="username"
                className="text-sm font-bold text-[#2B3674] ml-1"
              >
                Username<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors">
                  <UserIcon size={18} />
                </div>
                <Input
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Your username"
                  className="pl-12 pr-6 h-12 rounded-2xl border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[#4318FF] focus:ring-0 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-bold text-[#2B3674] ml-1"
              >
                Password<span className="text-[#4318FF]">*</span>
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4318FF] transition-colors">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={hiddenPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-12 pr-12 h-12 rounded-2xl border-gray-200 bg-white text-sm placeholder:text-gray-300 focus:border-[#4318FF] focus:ring-0 transition-all font-medium"
                />
                <div
                  onClick={() => setHiddenPassword(!hiddenPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {hiddenPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
              </div>
            </div>

            {/* Checkbox and Forgot Password */}
            <div className="flex items-center justify-between mt-1 mb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="keep-logged-in"
                  className="border-gray-200 data-[state=checked]:bg-[#4318FF] data-[state=checked]:border-[#4318FF] rounded"
                />
                <Label
                  htmlFor="keep-logged-in"
                  className="text-xs text-[#2B3674] font-medium cursor-pointer"
                >
                  Keep me logged in
                </Label>
              </div>
              <a
                href="#"
                className="text-xs font-bold text-[#4318FF] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              className="w-full h-12 text-sm font-bold rounded-2xl bg-[#4318FF] hover:bg-[#3311db] shadow-lg shadow-blue-700/20 active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin h-5 w-5" />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center md:hidden">
            <p className="text-sm text-gray-400">
              © 2026 SIPEKAD. All Rights Reserved.
            </p>
          </div>
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#4318FF]/80 to-[#707EFE]/40 backdrop-blur-[2px]"></div>
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

          {/* Feature Highlights - Professional Grid */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-[500px] mb-12">
            {[
              {
                icon: <UserIcon size={20} />,
                title: "User Friendly",
                desc: "Intuitive interface",
              },
              {
                icon: <Lock size={20} />,
                title: "Highly Secure",
                desc: "Data protection",
              },
              {
                icon: <LoaderCircle size={20} />,
                title: "Real-time",
                desc: "Instant updates",
              },
              {
                icon: <Eye size={20} />,
                title: "Transparent",
                desc: "Track progress",
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

          {/* Official Website Info */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="rounded-[30px] border border-white/20 bg-white/10 px-8 py-5 backdrop-blur-xl shadow-2xl inline-block"
          >
            <p className="text-[10px] font-bold text-white/50 mb-1 uppercase tracking-[0.2em]">
              Support Center
            </p>
            <a
              href="#"
              className="text-lg font-bold text-white hover:text-blue-100 transition-colors"
            >
              help.sipekad.ac.id
            </a>
          </Motion.div>
        </Motion.div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-10 z-10 flex gap-8 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
          {["Marketplace", "License", "Terms", "Blog"].map((link) => (
            <span
              key={link}
              className="cursor-pointer hover:text-white transition-colors"
            >
              {link}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
