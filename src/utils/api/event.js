import Axios from "axios";
import BASE_URL from "./index.js";

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("tokenKey")}` });

const errorMessage = (err, fallback) => {
  const msg = err.response?.data?.message;
  if (!msg) return fallback;
  if (typeof msg === "string") return msg;
  // zod fieldErrors: { field: [messages] }
  return Object.values(msg).flat().join(", ") || fallback;
};

const call = async (method, path, { data, params, fallback = "Terjadi kesalahan", headers } = {}) => {
  try {
    const res = await Axios({ method, url: `${BASE_URL}/events${path}`, data, params, headers: { ...auth(), ...headers } });
    return res.data;
  } catch (err) {
    return { status: "fail", message: errorMessage(err, fallback) };
  }
};

export const getPeriods = (eventType) => call("get", "/periods", { params: eventType ? { event_type: eventType } : {} });
export const getPeriod = (id) => call("get", `/periods/${id}`);
export const createPeriod = (body) => call("post", "/periods", { data: body, fallback: "Gagal membuat gelombang" });
export const updatePeriod = (id, body) => call("put", `/periods/${id}`, { data: body, fallback: "Gagal menyimpan gelombang" });
export const deletePeriod = (id) => call("delete", `/periods/${id}`, { fallback: "Gagal menghapus gelombang" });

export const getTemplates = (eventType, includeInactive = false) =>
  call("get", "/templates", { params: { event_type: eventType, include_inactive: includeInactive ? "true" : undefined } });
export const createTemplate = (body) => call("post", "/templates", { data: body, fallback: "Gagal menambah syarat" });
export const updateTemplate = (id, body) => call("put", `/templates/${id}`, { data: body, fallback: "Gagal menyimpan syarat" });
export const reorderTemplates = (ids) => call("patch", "/templates/reorder", { data: { ids }, fallback: "Gagal mengubah urutan" });

export const registerPeriod = (id, message) =>
  call("post", `/periods/${id}/register`, { data: { message }, fallback: "Gagal mendaftar" });

export const uploadItem = (itemId, file) => {
  const form = new FormData();
  form.append("file", file);
  return call("post", `/items/${itemId}/upload`, { data: form, fallback: "Gagal mengunggah berkas" });
};
export const reviewItem = (itemId, status, note) =>
  call("patch", `/items/${itemId}/review`, { data: { status, admin_note: note || null }, fallback: "Gagal menyimpan penilaian" });
export const submitReview = (requestId) =>
  call("post", `/requests/${requestId}/submit-review`, { fallback: "Gagal mengirim hasil verifikasi" });
export const saveSchedule = (requestId, body) =>
  call("put", `/requests/${requestId}/schedule`, { data: body, fallback: "Gagal menyimpan jadwal" });
