import { Outlet, useNavigate } from "react-router"
import Sidebar from "../components/sidebar/Sidebar"
import HeaderDashboard from "../components/Header/HeaderDashboard"
import { useState, useEffect } from "react"

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tokenKey');
    if (token) {
      setIsLogin(true)
    } else {
      setIsLogin(false);
      navigate('/');
    }
  }, [])

  if (!isLogin) {
    return null
  }
  
  return (
    <>
    <main className="flex gap-3 md:gap-4 bg-gray-100 h-screen">
      <Sidebar activeSidebar={sidebarActive} setActiveSideBar={setSidebarActive} />
      <div className="flex-4 pr-4 md:pr-8 overflow-y-scroll">
        <Outlet />
      </div>
    </main>
    </>
  )

}

export default Dashboard