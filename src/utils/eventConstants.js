export const EVENT_TYPES = {
  seminar_kp: { label: "Seminar Kerja Praktik", short: "Seminar KP", requestType: "Seminar Kp" },
  seminar_skripsi: { label: "Seminar Skripsi", short: "Seminar Skripsi", requestType: "Surat Sempro" },
  sidang_skripsi: { label: "Sidang Skripsi", short: "Sidang Skripsi", requestType: "Sidang Skripsi" },
};

// Student registration page for each event type.
export const EVENT_ROUTES = {
  seminar_kp: "/dashboard/seminar-sidang/seminar-kp",
  seminar_skripsi: "/dashboard/seminar-sidang/seminar-skripsi",
  sidang_skripsi: "/dashboard/seminar-sidang/sidang-skripsi",
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

export const PRODI_OPTIONS = ["Teknik Informatika", "Teknik Lingkungan", "Teknik Sipil"];

const parts = (value, withTime) => {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } : {}),
  });
  return Object.fromEntries(fmt.formatToParts(new Date(value)).map((p) => [p.type, p.value]));
};

// dd/mm/yyyy HH:mm WIB
export const formatDateTime = (value) => {
  if (!value) return "-";
  const p = parts(value, true);
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute} WIB`;
};

// dd/mm/yyyy. Plain "YYYY-MM-DD" strings (DATE columns) are formatted as-is, without timezone shifts.
export const formatDate = (value) => {
  if (!value) return "-";
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (plain) return `${plain[3]}/${plain[2]}/${plain[1]}`;
  const p = parts(value, false);
  return `${p.day}/${p.month}/${p.year}`;
};

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
