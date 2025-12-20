import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { Pen } from "lucide-react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

const UserBio = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <Link className="mb-4" to={"/dashboard"}>
        <ArrowLeft />
      </Link>
      <div className="relative bg-white shadow-md rounded-md p-8">
        <div className="bg-gradient-to-r from-purple-300 via-blue-200 to-blue-500 rounded-md relative h-40">
          <div className="size-40 flex items-center gap-4 absolute -bottom-20 left-1/2 -translate-x-1/2 rounded-full p-2 bg-white">
            {user?.url_photo ? (
              <img
                className="w-full h-full object-top object-cover"
                src={user.url_photo}
              />
            ) : (
              <img
                className="w-full h-full object-center object-cover"
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
            <Link
              to={"/dashboard/user/update"}
              className="block md:size-5 size-4"
            >
              <Pen className="w-full h-full" />
            </Link>
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
      </div>
    </>
  );
};

export default UserBio;
