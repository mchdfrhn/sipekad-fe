import { Outlet } from "react-router"
  
const DashboardUser = () => {
 
  
  return (
    <div className="p-layout flex flex-col justify-center pt-14">
      <Outlet />
    </div>
  )
}

export default DashboardUser