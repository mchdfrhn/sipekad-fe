import ListLink from "../ui/ListLink";
import { Skeleton } from "../ui/Loading";
import {
  kategoriPermintaan,
  kategoriKeterangan,
  kategoriPengajuan,
  kategoriPenugasan,
} from "../../utils/constant";
import { useSearchParams } from "react-router";
import { useRequestAccess } from "@/utils/hooks/useRequestAccess";

const Request = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const { loading, isAllowed } = useRequestAccess();

  // Map main categories to their sub-categories
  const subCategoriesMap = {
    "Surat Keterangan": kategoriKeterangan,
    "Surat Pengajuan": kategoriPengajuan,
    "Surat Penugasan": kategoriPenugasan,
  };

  // Hanya jenis yang dibuka untuk prodi mahasiswa; kategori yang semua isinya
  // ditutup ikut disembunyikan.
  const allowedSubs = (item) =>
    (subCategoriesMap[item.content] || []).filter((sub) => isAllowed(sub.type));

  const filteredKategori = kategoriPermintaan.filter((item) => {
    const subItems = subCategoriesMap[item.content];
    if (subItems) {
      if (allowedSubs(item).length === 0) return false;
    } else if (!isAllowed(item.type)) {
      return false;
    }

    const query = searchQuery.toLowerCase();
    // Check main category content
    if (item.content.toLowerCase().includes(query)) return true;

    // Check sub-categories if they exist for this item
    if (subItems) {
      return allowedSubs(item).some((sub) => sub.content.toLowerCase().includes(query));
    }

    return false;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {kategoriPermintaan.map((item) => (
          <Skeleton key={item.path} className="h-36 rounded-[20px]" />
        ))}
      </div>
    );
  }

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
