export const EVENT_TYPES = {
  seminar_kp: { label: "Seminar Kerja Praktik", short: "Seminar KP", requestType: "Seminar Kp" },
  seminar_skripsi: { label: "Seminar Skripsi", short: "Seminar Skripsi", requestType: "Surat Sempro" },
  sidang_skripsi: { label: "Sidang Skripsi", short: "Sidang Skripsi", requestType: "Sidang Skripsi" },
};

export const EVENT_TYPE_KEYS = Object.keys(EVENT_TYPES);

export const CATEGORY_LABELS = {
  berkas: "Berkas",
  akademik: "Akademik",
  administrasi: "Administrasi",
};

export const CATEGORY_ORDER = ["berkas", "akademik", "administrasi"];

export const PERIOD_STATE = {
  draft: { label: "Draf", cls: "bg-gray-100 text-gray-600" },
  upcoming: { label: "Segera Dibuka", cls: "bg-blue-50 text-blue-600" },
  open: { label: "Dibuka", cls: "bg-green-50 text-green-600" },
  closed: { label: "Ditutup", cls: "bg-red-50 text-red-500" },
};

export const ITEM_STATUS = {
  pending: { label: "Belum dilengkapi", cls: "bg-gray-100 text-gray-600" },
  submitted: { label: "Menunggu diperiksa", cls: "bg-blue-50 text-blue-600" },
  approved: { label: "Sesuai", cls: "bg-green-50 text-green-600" },
  revision: { label: "Perlu revisi", cls: "bg-orange-50 text-orange-600" },
};

const TZ = "Asia/Jakarta";

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("id-ID", {
        timeZone: TZ,
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    : "-";

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" })
    : "-";

// Convert ISO → value for <input type="datetime-local"> in Jakarta time.
export const toJakartaInput = (value) => {
  if (!value) return "";
  const d = new Date(new Date(value).getTime() + 7 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
};

// Convert <input type="datetime-local"> value (Jakarta) → ISO string.
export const fromJakartaInput = (value) => (value ? new Date(`${value}:00+07:00`).toISOString() : null);

export const groupByCategory = (items) =>
  CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);
