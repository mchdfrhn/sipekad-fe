import { LayoutDashboard, LogOut, User, Send, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import Alert from "../ui/Alert";
import { useState } from "react";
import { motion as Motion } from "motion/react";

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
      <Motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: activeSidebar ? "-100%" : "0%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`bg-white w-58 pt-12 shadow-md h-screen z-40 fixed left-0 md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {isDisplay && (
          <Alert
            setDisplay={setIsDisplay}
            isDisplay={isDisplay}
            onYesHundler={logoutHandler}
          />
        )}
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center px-8 mb-8"
        >
          <img
            src="/sttimage.png"
            alt="stt-logo"
            loading="lazy"
            className="w-40"
          />
        </Motion.div>
        <Motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className=""
        >
          {links.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Motion.li
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                className="cursor-pointer mb-2 relative"
                key={link.name}
              >
                <Link
                  onClick={() => setActiveSideBar(true)}
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
              </Motion.li>
            );
          })}
          <Motion.li
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
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
          </Motion.li>
        </Motion.ul>
      </Motion.aside>
    </>
  );
};

export default Sidebar;
