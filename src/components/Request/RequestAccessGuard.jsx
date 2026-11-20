import { useEffect } from "react";
import { Navigate } from "react-router";
import { useRequestAccess } from "@/utils/hooks/useRequestAccess";
import { useToast } from "@/utils/hooks/useToast";

/**
 * Membungkus halaman form pengajuan. Jika jenis pengajuan ditutup untuk prodi
 * mahasiswa, arahkan kembali ke daftar layanan (menu sudah disembunyikan, ini
 * untuk akses lewat URL langsung).
 */
const RequestAccessGuard = ({ type, children }) => {
  const { loading, isAllowed } = useRequestAccess();
  const { showToast } = useToast();
  const allowed = isAllowed(type);

  useEffect(() => {
    if (!loading && !allowed) {
      showToast("Jenis pengajuan ini tidak tersedia untuk program studi Anda", "error");
    }
  }, [loading, allowed, showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-7 w-7 rounded-full border-[3px] border-[#4318FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!allowed) return <Navigate to="/dashboard/request" replace />;
  return children;
};

export default RequestAccessGuard;
