import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useUser } from "../../utils/hooks/userContext";
import { loginFlow } from "../../utils/action";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const Login = () => {
  const { updateUserData } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = { username, password };
    await loginFlow(
      data,
      updateUserData,
      navigate,
      setErrMessage,
      setIsLoading,
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left Side - Form Section */}
      <div className="flex w-full flex-col justify-center items-center px-8 md:w-[50%] lg:px-20 xl:px-24">
        <div className="w-full max-w-[420px]">
          {/* Header / Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#2B3674] mb-2 tracking-tight">
              Sign In
            </h1>
            <p className="text-`gray-400 text-base">
              Enter your username and password to sign in!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
            {/* Username/Email Input */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-[#2B3674]"
              >
                Username<span className="text-blue-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="mail@simmmple.com"
                  className="p-6 h-12 rounded-2xl border-gray-200 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#2B3674]"
              >
                Password<span className="text-blue-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={hiddenPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="p-6 h-12 pr-10 rounded-2xl border-gray-200 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
                <div
                  onClick={() => setHiddenPassword(!hiddenPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  {hiddenPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
              </div>
            </div>

            {/* Checkbox and Forgot Password */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="keep-logged-in"
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white rounded"
                />
                <Label
                  htmlFor="keep-logged-in"
                  className="text-sm text-[#2B3674] font-normal cursor-pointer"
                >
                  Keep me logged in
                </Label>
              </div>
              <a
                href="#"
                className="text-sm font-bold text-blue-500 hover:text-blue-600"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button
              className="w-full h-14 text-sm font-bold rounded-2xl bg-[#4318FF] hover:bg-[#3311db] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin">
                  <LoaderCircle />
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Error Message */}
            {errMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: ["easeInOut"] }}
                className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200"
              >
                <p>{errMessage}</p>
              </motion.div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="mt-auto md:absolute md:bottom-6 md:left-24">
          <p className="text-center text-sm text-gray-400">
            © 2026 SIPEKAD. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Gradient & Brand */}
      <div
        className="relative hidden w-[50%] flex-col items-center justify-center rounded-bl-[200px] md:flex"
        style={{
          background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)",
        }}
      >
        {/* Logo Container */}
        <div className="mb-2">
          <img
            src="/sttimage.png"
            alt="Logo STT"
            className="h-32 w-auto drop-shadow-xl"
          />
        </div>

        <h1 className="text-5xl font-bold text-white tracking-wide mb-2">
          SIPEKAD
        </h1>
        <p className="text-white text-xl font-normal tracking-wide">
          Sistem Pengajuan Akademik
        </p>

        {/* Illustration */}
        <div className="my-6 w-[65%] max-w-[380px]">
          <img
            src="/login.svg"
            alt="Login Illustration"
            className="w-full h-auto drop-shadow-2xl opacity-90"
          />
        </div>

        {/* Glassmorphism Card */}
        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/20 bg-white/5 p-8 backdrop-blur-xl max-w-[320px] shadow-2xl">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-100 mb-3">
              Learn more about SIPEKAD on
            </p>
            <a
              href="#"
              className="text-xl font-bold text-white hover:text-blue-100 transition-colors block"
            >
              sipekad.ac.id
            </a>
          </div>
        </div>

        {/* Bottom Links (Visual Only) */}
        <div className="absolute bottom-6 flex gap-10 text-xs font-medium text-white/60">
          <span className="cursor-pointer hover:text-white transition-colors">
            Marketplace
          </span>
          <span className="cursor-pointer hover:text-white transition-colors">
            License
          </span>
          <span className="cursor-pointer hover:text-white transition-colors">
            Terms of Use
          </span>
          <span className="cursor-pointer hover:text-white transition-colors">
            Blog
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
