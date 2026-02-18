import ListLink from "../ui/ListLink";
import {
  kategoriPermintaan,
  kategoriKeterangan,
  kategoriPengajuan,
  kategoriPenugasan,
} from "../../utils/constant";
import { useSearchParams } from "react-router";

const Request = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // Map main categories to their sub-categories
  const subCategoriesMap = {
    "Surat Keterangan": kategoriKeterangan,
    "Surat Pengajuan": kategoriPengajuan,
    "Surat Penugasan": kategoriPenugasan,
  };

  const filteredKategori = kategoriPermintaan.filter((item) => {
    const query = searchQuery.toLowerCase();
    // Check main category content
    if (item.content.toLowerCase().includes(query)) return true;

    // Check sub-categories if they exist for this item
    const subItems = subCategoriesMap[item.content];
    if (subItems) {
      return subItems.some((sub) => sub.content.toLowerCase().includes(query));
    }

    return false;
  });

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
Users are reporting that search and filter functionalities are case-sensitive. This is primarily due to strict equality checks (=) in SQL queries in the backend.

