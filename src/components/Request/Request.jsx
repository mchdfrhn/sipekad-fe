import ListLink from "../ui/ListLink";
import { kategoriPermintaan } from "../../utils/constant";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const Request = () => {
  return (
    <div className="space-y-6">
      <ListLink data={kategoriPermintaan} title={"Pilih Jenis Layanan"} />
    </div>
  );
};

export default Request;
