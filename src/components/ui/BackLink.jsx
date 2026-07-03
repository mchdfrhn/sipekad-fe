import { Link, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion as Motion } from "motion/react";

const BackLink = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  if (pathParts.length <= 2) {
    return null;
  }

  const backpath = "/" + pathParts.slice(0, -1).join("/");

  return (
    <Motion.div
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex"
    >
      <Link
        className="flex items-center gap-4 mb-8 hover:text-[#4318FF] transition-colors"
        to={backpath}
      >
        <ArrowLeft />
      </Link>
    </Motion.div>
  );
};

export default BackLink;
