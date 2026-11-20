import { useEffect, useState } from "react";
import { getMyRequestAccess } from "../api/requestAccess";

/**
 * Jenis pengajuan yang ditutup untuk prodi mahasiswa yang sedang login.
 * Selama memuat atau jika gagal memuat, tidak ada yang disembunyikan; backend
 * tetap menolak pengajuan yang tidak diizinkan.
 */
export const useRequestAccess = () => {
  const [state, setState] = useState({ loading: true, blocked: [] });

  useEffect(() => {
    let active = true;
    getMyRequestAccess().then((res) => {
      if (!active) return;
      setState({
        loading: false,
        blocked: res.status === "success" ? res.data.blocked_types : [],
      });
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    loading: state.loading,
    isAllowed: (type) => !type || !state.blocked.includes(type),
  };
};
