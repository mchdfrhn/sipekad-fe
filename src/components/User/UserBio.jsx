import { Mail } from "lucide-react";
import { Phone } from "lucide-react";
import { Pen } from "lucide-react";
import { Link } from "react-router";

const UserBio = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <div
        className="relative w-xs md:w-xl flex items-center flex-col md:flex-row px-8 py-6 rounded-xl gap-4 md:gap-8 bg-white shadow-xl"
        action=""
      >
        <div className="md:size-80 rounded-md overflow-hidden mb-2">
          {user?.url_photo ? (
            <img
              className="w-full h-full object-top object-cover"
              src={ user.url_photo }
            />
          ) : (
            <img
              className="w-full h-full object-center object-cover"
              src="/avatar.png"
              alt="image user"
            />
          )}
        </div>

        <div className="">
          <h1 className="mt-4 text-2xl md:text-4xl font-bold">
            {user.username}
          </h1>
          <p className="mb-2">{user?.nim}</p>
          <p className="flex items-center gap-4 mt-2">
            <Phone />
            {user.phone}
          </p>
          <p className="flex items-center gap-4 mt-1">
            <Mail />
            {user.email}
          </p>
        </div>
        <Link
          to={"/dashboard/user/update"}
          className="absolute -top-3 -right-3 bg-white shadow-md p-1.5 rounded-full"
        >
          <Pen />
        </Link>
      </div>
    </>
  );
};

export default UserBio;
