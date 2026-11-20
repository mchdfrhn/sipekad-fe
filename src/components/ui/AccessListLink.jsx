import ListLink from "./ListLink";
import EmptyState from "./EmptyState";
import { Skeleton } from "./Loading";
import { useRequestAccess } from "@/utils/hooks/useRequestAccess";

/**
 * ListLink yang hanya menampilkan jenis pengajuan yang dibuka untuk prodi
 * mahasiswa. Item tanpa `type` selalu tampil.
 */
const AccessListLink = ({ data, title }) => {
  const { loading, isAllowed } = useRequestAccess();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {data.map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-[20px]" />
        ))}
      </div>
    );
  }

  const visible = data.filter((item) => isAllowed(item.type));
  if (visible.length === 0) {
    return (
      <EmptyState
        title="Layanan belum tersedia"
        description="Jenis pengajuan ini tidak tersedia untuk program studi Anda di SIPEKAD. Silakan hubungi admin prodi."
      />
    );
  }

  return <ListLink data={visible} title={title} />;
};

export default AccessListLink;
