import { Bell } from "lucide-react"
import { useUser } from "../../utils/hooks/userContext"
import { motion } from "motion/react";

const HeaderDashboard = () => {
  const { userData } = useUser();
  return (
    <motion.header initial={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 0.5, ease: ["easeInOut"] }} className="w-full bg-white shadow-md rounded-md mb-8 px-4 py-2 flex justify-start items-center gap-4">
      <div className="size-12 rounded-full overflow-hidden">
        <img src={ userData?.url_photo ? userData?.url_photo : "/avatar.png" } alt="" className="w-full h-full object-center object-cover" />
      </div>
      <h2 className="font-bold tracking-[2px] uppercase text-xs md:text-lg">{userData?.full_name}</h2>
      <div>
        <Bell />
      </div>
    </motion.header>
  )
}

export default HeaderDashboard