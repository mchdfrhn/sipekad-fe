import Axios from "axios";
import BASE_URL from "./index.js";

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("tokenKey")}` });

const errorMessage = (err, fallback) => {
  const msg = err.response?.data?.message;
  if (!msg) return fallback;
  if (typeof msg === "string") return msg;
  return Object.values(msg).flat().join(", ") || fallback;
};

const call = async (method, path, { data, fallback = "Terjadi kesalahan" } = {}) => {
  try {
    const res = await Axios({ method, url: `${BASE_URL}/request-access${path}`, data, headers: auth() });
    return res.data;
  } catch (err) {
    return { status: "fail", message: errorMessage(err, fallback) };
  }
};

// Mahasiswa: jenis pengajuan yang ditutup untuk prodinya.
export const getMyRequestAccess = () => call("get", "/me", { fallback: "Gagal memuat akses pengajuan" });

// Admin: matriks jenis pengajuan x prodi.
export const getRequestAccessMatrix = () => call("get", "/", { fallback: "Gagal memuat pengaturan akses" });
export const saveRequestAccessMatrix = (items) =>
  call("put", "/", { data: { items }, fallback: "Gagal menyimpan pengaturan akses" });
