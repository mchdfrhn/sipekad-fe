import ListLink from "../ui/ListLink";
import { kategoriPermintaan } from "../../utils/constant";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const Request = () => {
  return (
    <>
      <Link className="mb-4 block flex items-center" to={"/dashboard"}>
        <ArrowLeft />{" "}
      </Link>
      <ListLink
        data={kategoriPermintaan}
        title={"Silahkan pilih apa yang mau diminta"}
      />
    </>
  );
};

export default Request;
