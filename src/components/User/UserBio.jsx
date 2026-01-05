import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { Pen } from "lucide-react";
import { Link } from "react-router";
import FormUpdateUser from "../dashboardUser/FormUpdateUser";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react"
import { useState } from "react";

const UserBio = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      <Link className="mb-4" to={"/dashboard"}>
        <ArrowLeft />
      </Link>
      {showForm && (
        <div className="bg-black/20 z-20 fixed inset-0 w-screen h-screen"></div>
      )}
      {showForm && (
         <FormUpdateUser showForm={showForm} setShowForm={setShowForm} />
      )}
     
      <motion.div initial={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ duration: 0.5, ease: ["easeInOut"] }} className="relative bg-white shadow-md rounded-md p-4">
        <div className="bg-gradient-to-r from-purple-300 via-blue-200 to-blue-500 rounded-md relative h-40">
       
          <div className="size-40 flex items-center gap-4 absolute -bottom-20 left-1/2 -translate-x-1/2 rounded-full p-2 bg-white">
            {user?.url_photo ? (
              <img
                className="w-full h-full object-top object-cover rounded-full"
                src={user.url_photo}
              />
            ) : (
              <img
                className="w-full h-full object-center object-cover rounded-full"
                src="/avatar.png"
                alt="image user"
              />
            )}
            <div></div>
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-center items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-sm md:text-2xl tracking-[4px] font-bold uppercase">
              {user.username}
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="block md:size-5 size-4 cursor-pointer"
            >
              <Pen className="w-full h-full" />
            </button>
          </div>
          <p className="text-xs md:text-xl tracking-[4px] text-gray-400">
            {user?.nim}
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div className="size-4">
              <Phone className="w-full h-full" />
            </div>
            <p className="flex items-center md:text-xl text-sm">{user.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4">
              <Mail className="w-full h-full" />
            </div>
            <p className="text-sm md:text-xl">{user.email}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default UserBio;
