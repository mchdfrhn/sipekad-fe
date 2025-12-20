import { Bell } from "lucide-react"
import { useUser } from "../../utils/hooks/userContext"

const HeaderDashboard = () => {
  const { userData } = useUser();
  return (
    <header className="w-full bg-white shadow-md rounded-md mb-8 px-4 py-2 flex justify-end items-center gap-4">
      <h2 className="font-bold tracking-[2px] uppercase text-xs md:text-lg">{userData?.full_name}</h2>
      <div className="size-12 rounded-full overflow-hidden">
        <img src={ userData?.url_photo ? userData?.url_photo : "/avatar.png" } alt="" className="w-full h-full object-center object-cover" />
      </div>
      <div>
        <Bell />
      </div>
    </header>
  )
}

export default HeaderDashboard