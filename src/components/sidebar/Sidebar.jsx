import { LayoutDashboard, LogOut, User, Send, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import Alert from "../ui/Alert";
import { useState } from "react";

const Sidebar = ({ activeSidebar, setActiveSideBar, links }) => {
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
        className={`bg-white pt-12 pr-8 pl-2 shadow-md h-screen z-40 fixed left-0 ${activeSidebar && "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {isDisplay && (
          <Alert
            setDisplay={setIsDisplay}
            isDisplay={isDisplay}
            onYesHundler={logoutHandler}
          />
        )}
        <div className="flex justify-center items-center mb-8">
          <img
            src="/sttimage.png"
            alt="stt-logo"
            loading="lazy"
            className="w-40"
          />
        </div>
        <ul className="">
          {links.map((link) => {
            const isActive = pathname === link.path;

            return (
              <li className="cursor-pointer mb-2 relative" key={link.name}>
                <Link
                  onClick={() => setActiveSideBar(!activeSidebar)}
                  to={link.path}
                  className={`flex items-center gap-3 px-8 py-3 text-sm font-medium transition-all duration-200 
                    ${
                      isActive
                        ? "text-indigo-900 font-bold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-1 rounded-l-lg bg-indigo-600" />
                  )}

                  <div
                    className={`${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-800"}`}
                  >
                    <link.icon
                      className="h-5 w-5"
                      fill={isActive ? "currentColor" : "none"}
                    />
                  </div>
                  <p>{link.name}</p>
                </Link>
              </li>
            );
          })}
          <li
            onClick={() => setIsDisplay(!isDisplay)}
            className="mt-8 group w-full cursor-pointer relative"
          >
            <button
              className={`flex items-center gap-3 px-8 py-3 w-full text-sm font-medium text-gray-500 hover:text-gray-800 transition-all duration-200`}
            >
              <div className="text-gray-400 group-hover:text-gray-800">
                <LogOut className="h-5 w-5" />
              </div>
              <p>Logout</p>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
