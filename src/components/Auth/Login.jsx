import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useUser } from "../../utils/hooks/userContext";
import { loginFlow } from "../../utils/action";
import { motion } from "motion/react"

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
    await loginFlow(data, updateUserData, navigate, setErrMessage, setIsLoading);
  };

  return (
    <div className="flex justify-center items-center bg-slate-100 h-screen md:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1}} transition={{ duration: 0.5, ease: ["easeInOut"] }} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-md rounded-md">
        <div className="flex justify-center items-center flex-col pb-10 xl:py-20">
          <div className="flex flex-col text-center mb-4">
            <h1 className="text-4xl font-bold text-slate-800 mt-8 md:m-0">SIPEKAD</h1>
            <p className="font-semibold text-sm text-slate-50 bg-blue-500 rounded-md border px-2">
              Sistem Pengajuan Akademis
            </p>
          </div>
          <form
            onSubmit={onSubmitHandler}
            className="bg-slate-50 text-gray-800 rounded-xl px-6 w-full "
          >
            <div className="flex flex-col mb-4 gap-2">
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                className="input"
                placeholder="Username"
              />
            </div>
            <div className="mb-4 gap-2 relative">
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
            <button className={`py-1 ${ isLoading ? "bg-blue-500/50" : "bg-blue-500 " } flex justify-center text-white border-transparent border hover:border-blue-500 hover:bg-transparent hover:text-blue-500 transition-color duration-300 ease-in-out w-full cursor-pointer rounded-md`}>
              {
                isLoading ? <div className="animate-spin"><LoaderCircle /></div> : "login"
              }
            </button>
            {
              errMessage && <motion.div initial={{opacity: 0}} whileInView={{ opacity: 1 }} transition={{ duration: 0.1, ease: ["easeInOut"] }} className="rounded-md p-2 text-red-600 mt-4 bg-red-500/20 text-sm">
              <p className="">{errMessage}</p>
            </motion.div>
            }
          </form>
        </div>
        <div className="bg-blue-400 hidden md:block shadow-[-4px_0_3px_0px_rgba(0,0,0,0.2)]">
          <img src={"/login.svg"} alt="" className="w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
