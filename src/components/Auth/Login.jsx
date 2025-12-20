import loginImage from "../../assets/login.svg";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../utils/api/auth";
import { useNavigate } from "react-router";
import { useUser } from "../../utils/hooks/userContext";

const Login = () => {
  const { updateUserData } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const responseLogin = await login({ email, password });
    if (responseLogin.status === "success") {
      localStorage.setItem("tokenKey", responseLogin.accessToken);
      updateUserData(responseLogin.user);
      localStorage.setItem("user", JSON.stringify(responseLogin.user));
      navigate("/dashboard");

      if (responseLogin.user.role === "admin") {
        navigate("/admin");
      }
    }

    if (responseLogin.status === "error") {
      setErrMessage("Email atau password salah");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5  bg-slate-100 h-screen">
      <div className="flex flex-col gap-4 xl:col-span-2 justify-center items-center">
        <div className="flex flex-col text-center mb-4">
          <h1 className="text-4xl font-bold text-slate-800">SIPEKAD</h1>
          <p className="font-semibold text-sm text-slate-50 bg-yellow-500 rounded-md border px-2">
            Sistem Pengajuan Akademis
          </p>
        </div>
        <form
          onSubmit={onSubmitHandler}
          className="shadow-xl bg-slate-50 text-gray-800 rounded-xl px-6 md:w-100 py-8"
        >
          <div className="flex flex-col mb-4 gap-2 font-semibold">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              className="input"
              placeholder="Email"
            />
          </div>
          <div className="mb-4 gap-2 relative font-semibold">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={hiddenPassword ? "text" : "password"}
              className="input w-full"
              placeholder="Password"
            />
            <div
              onClick={() => setHiddenPassword(!hiddenPassword)}
              className="absolute right-4 text-slate-500 cursor-pointer bottom-2"
            >
              {hiddenPassword ? <Eye /> : <EyeOff />}
            </div>
          </div>
          <button className="button-yellow-home w-full cursor-pointer rounded-md">
            Login
          </button>
          <p className="mt-4 text-sm font-semibold text-red-500 text-center">
            {errMessage}
          </p>
        </form>
      </div>
      <div className="bg-slate-50 h-screen hidden xl:col-span-3 xl:block shadow-xl md:p-20">
        <img src={loginImage} alt="" className="w-full h-full" />
      </div>
    </div>
  );
};

export default Login;
