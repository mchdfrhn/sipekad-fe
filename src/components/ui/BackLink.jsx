import { Link, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";

const BackLink = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  if (pathParts.length <= 2) {
    return null;
  }

  const backpath = "/" + pathParts.slice(0, -1).join("/");

  return (
    <Link className="flex items-center gap-4 mb-8" to={backpath}>
      <ArrowLeft />
    </Link>
  );
};

export default BackLink;
