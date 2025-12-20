import { LayoutDashboard, LogOut, User, Send, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";


const Sidebar = ({ activeSidebar, setActiveSideBar }) => {

  const navigate = useNavigate();

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
      path: "/dashboard",
      name: "dashboard",
      icon: LayoutDashboard
    },
    {
      path: "/dashboard/request",
      name: "Minta Permintaan",
      icon: Send
    },
    {
      path: "/dashboard/user",
      name: "User",
      icon: User
    }
  ]
  const { pathname } = useLocation();
  return (
    <aside className={`bg-white pt-12 md:px-2 ${ activeSidebar && "w-[50%] md:w-xs" } shadow-md`}>
      <ul className="">
        <li className={`mb-4 flex justify-start`}>
          <div onClick={() => setActiveSideBar(!activeSidebar)} className="p-4 cursor-pointer hover:bg-gray-800/20 transition-duration rounded-full">
            <div className=" size-4 md:size-6">
            { activeSidebar ? <X className="w-full h-full" /> : <Menu className="w-full h-full" /> }
            </div>
          </div>
        </li>
        {
          links.map((link) => (
            <li className="cursor-pointer mt-2 group">
              <Link to={link.path} className={`p-4 text-xs md:text-lg rounded-md block group-hover:bg-gray-800/20 flex max-w-sm:justify-center items-center gap-4 transition-duration ${ pathname === link.path && "bg-gray-800/20" }`}>
                <div className="size-4 md:size-6"><link.icon className="w-full h-full" /></div>
                { activeSidebar && <p className="">{ link.name }</p> }
              </Link>
            </li>
          ))
        }
        <li onClick={logoutHandler} className="mt-8 px-4">
          <Link className="flex items-center pb-4 border-transparent group-hover:border-slate-800 border-b-4 transition-colors transition-duration gap-4">
          <div className=" size-4 md:size-6 flex">
            <LogOut className="w-full h-full" />
          </div>
            {
              activeSidebar && <p className="text-xs md:text-lg">Logout</p>
            }
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
