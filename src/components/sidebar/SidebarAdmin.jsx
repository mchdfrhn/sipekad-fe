import { LayoutDashboard, LogOut, User, Send, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import Alert from "../ui/Alert";
import { useState } from "react";

const SidebarAdmin = ({ activeSidebar, setActiveSideBar }) => {
  const navigate = useNavigate();
  const [isDisplay, setIsDisplay] = useState(false);

  const logoutHandler = async () => {
    const token = localStorage.getItem("tokenKey");

    if (token) {
      navigate("/");
      localStorage.removeItem("tokenKey");
      localStorage.removeItem("user");
    }
  };

  const links = [
    {
      path: "/admin",
      name: "dashbord",
      icon: LayoutDashboard,
    },
    {
      path: "/admin/user",
      name: "User",
      icon: User,
    },
    {
      path: "/admin/pengajuan",
      name: "Pengajuan",
      icon: Send,
    },
  ];

  const { pathname } = useLocation();
  return (
    <>
      <button
        onClick={() => setActiveSideBar(!activeSidebar)}
        className="block md:hidden fixed right-8 rounded-full shadow-md cursor-pointer bg-white p-2 top-14 z-40"
      >
        <Menu />
      </button>
      <aside
        className={`bg-white pt-12 pr-8 pl-2 shadow-md h-screen z-40 fixed left-0 ${
          activeSidebar && "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {isDisplay && (
          <Alert
            setDisplay={setIsDisplay}
            isDisplay={isDisplay}
            onYesHundler={logoutHandler}
          />
        )}
        <div className="flex justify-center items-center">
          <img
            src="/sttimage.png"
            alt="stt-logo"
            loading="lazy"
            className="w-40"
          />
        </div>
        <ul className="">
          {links.map((link) => (
            <li className="cursor-pointer mt-2 group">
              <Link
                onClick={() => setActiveSideBar(!activeSidebar)}
                to={link.path}
                className={`p-4 text-xs md:text-lg rounded-md block group-hover:bg-blue-500/20 hover:text-blue-500 hover:translate-x-1 flex max-w-sm:justify-center items-center gap-2 transition-duration ${
                  pathname === link.path &&
                  "bg-blue-500/20 text-blue-500  translate-x-1"
                }`}
              >
                <div className="size-4 md:size-6">
                  <link.icon className="w-full h-full" />
                </div>
                <p className="text-sm">{link.name}</p>
              </Link>
            </li>
          ))}
          <li
            onClick={() => setIsDisplay(!isDisplay)}
            className="mt-8 group w-full"
          >
            <button
              className={`p-4 text-xs md:text-lg rounded-md cursor-pointer block group-hover:bg-blue-500/20 w-full h-full hover:text-blue-500 hover:translate-x-1 flex max-w-sm:justify-center items-center gap-2 transition-duration`}
            >
              <div className=" size-4 md:size-6 flex">
                <LogOut className="w-full h-full" />
              </div>
              <p className="text-xs md:text-sm">Logout</p>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default SidebarAdmin;
