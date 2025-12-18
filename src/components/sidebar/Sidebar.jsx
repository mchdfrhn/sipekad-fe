import { LayoutDashboard, LogOut, User, Send } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useUser } from "../../utils/hooks/userContext";


const Sidebar = ({ activeSidebar, setActiveSideBar }) => {
  const { userData } = useUser();

  const navigate = useNavigate();

  const logoutHandler = async () => {
    const token = localStorage.getItem("tokenKey");

    if (token) {
      navigate("/");
      localStorage.removeItem("tokenKey");
      localStorage.removeItem("user");
    }
  };
  const { pathname } = useLocation();
  return (
    <aside
      className={`fixed w-4/6 md:w-1/3 xl:w-2/8 ${
        activeSidebar ? "-translate-x-0" : "-translate-x-full"
      } z-40 shadow-2xl xl:translate-x-0 transition-duration transition-transform bg-white h-screen`}
    >
      <div className="flex shadow-xl rounded-xl items-center pl-4 py-9 gap-4">
        <div className="size-20 rounded-full overflow-hidden">
          {userData?.url_photo ? (
            <img className="w-full h-full object-cover object-center" src={ userData.url_photo } alt="user image" />
          ) : (
            <img
              className="w-full h-full object-cover object-center"
              src="/avatar.png"
              alt=""
            />
          )}
        </div>
        <div>
          <p className="md:text-xl font-semibold text-slate-800">
            {userData?.username}
          </p>
          <p className="font-semibold text-slate-600">{userData?.nim}</p>
        </div>
      </div>
      <ul className="pt-8 flex flex-col justify-center text-slate-800 items-center text-center">
        <li className={`list-sidebar group`}>
          <Link
            onClick={() => setActiveSideBar(!activeSidebar)}
            to={"/dashboard"}
            className={`flex items-center py-2 group-hover:border-slate-800 border-b-4 gap-2 transition-colors transition-duration ${
              pathname === "/dashboard"
                ? "border-slate-800"
                : "border-transparent"
            }`}
          >
            <LayoutDashboard />
            Dashboard
          </Link>
        </li>
        <li className={`list-sidebar group`}>
          <Link
            onClick={() => setActiveSideBar(!activeSidebar)}
            to={"/dashboard/request"}
            className={`flex py-2 items-center group-hover:border-slate-800 border-b-4 gap-2 transition-colors transition-duration ${
              pathname === "/dashboard/request"
                ? "border-slate-800"
                : "border-transparent"
            }`}
          >
            <Send />
            Minta Permintaan
          </Link>
        </li>
        <li className={`list-sidebar group`}>
          <Link
            onClick={() => setActiveSideBar(!activeSidebar)}
            to={"/dashboard/user"}
            className={`flex py-2 items-center group-hover:border-slate-800 border-b-4 transition-colors transition-duration gap-2 ${
              pathname === "/dashboard/user"
                ? "border-slate-800"
                : "border-transparent"
            }`}
          >
            <User /> User
          </Link>
        </li>
        <li onClick={logoutHandler} className="mt-8  list-sidebar group">
          <Link className="flex items-center pb-4 border-transparent group-hover:border-slate-800 border-b-4 transition-colors transition-duration gap-2">
            <LogOut />
            Log Out
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
