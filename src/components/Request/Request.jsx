import ListLink from "../ui/ListLink";
import { kategoriPermintaan } from "../../utils/constant";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const Request = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const filteredKategori = kategoriPermintaan.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <ListLink
        data={filteredKategori}
        title={
          searchQuery
            ? `Hasil Pencarian: "${searchQuery}"`
            : "Pilih Jenis Layanan"
        }
      />
      {filteredKategori.length === 0 && (
        <div className="text-center py-10 bg-white rounded-[20px] shadow-sm">
          <p className="text-gray-400 font-medium">Layanan tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
};

export default Request;
