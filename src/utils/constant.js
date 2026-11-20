import {
  FileText,
  FileSpreadsheet,
  ClipboardList,
  GraduationCap,
  ScrollText,
  UserCheck,
  BookOpen,
  Briefcase,
  Users,
  Clock,
  XCircle,
} from "lucide-react";

// Route pengajuan
const kategoriPermintaan = [
  {
    content: "Surat Keterangan",
    path: "/dashboard/request/suratketerangan",
    color: "button-yellow",
    icon: FileText,
  },
  {
    content: "Surat Pengajuan",
    path: "/dashboard/request/suratpengajuan",
    color: "button-green",
    icon: ScrollText,
  },
  {
    content: "Surat Penugasan",
    path: "/dashboard/request/suratpenugasan",
    color: "button-blue",
    icon: ClipboardList,
  },
  {
    content: "Transkrip Nilai",
    path: "/dashboard/request/transkripnilai",
    type: "Transkrip Nilai",
    color: "button-orange",
    icon: FileSpreadsheet,
  },
  {
    content: "Permohonan Yudisium",
    path: "/dashboard/request/yudisium",
    type: "Yudisium",
    color: "button-gray",
    icon: GraduationCap,
  },
];

export const STUDENT_PRODI = {
  TEKNIK_INFORMATIKA: "Teknik Informatika",
  TEKNIK_LINGKUNGAN: "Teknik Lingkungan",
  TEKNIK_SIPIL: "Teknik Sipil",
};

export const USER_ROLE = {
  USER_REGULAR: "user",
  USER_ADMIN: "admin",
};

const kategoriKeterangan = [
  {
    content: "Keterangan Mahasiswa Aktif",
    path: "/dashboard/request/suratketerangan/mahasiswaaktif",
    type: "Mahasiswa Aktif",
    color: "button-green",
    icon: UserCheck,
  },
  {
    content: "Keterangan Cuti",
    path: "/dashboard/request/suratketerangan/cuti",
    type: "Keterangan Cuti",
    color: "button-gray",
    icon: Clock,
  },
  {
    content: "Keterangan Lulus",
    path: "/dashboard/request/suratketerangan/keteranganlulus",
    type: "Keterangan Lulus",
    color: "button-blue",
    icon: GraduationCap,
  },
  {
    content: "Pengunduran Diri",
    path: "/dashboard/request/suratketerangan/pengundurandiri",
    type: "Pengunduran Diri",
    color: "button-red",
    icon: XCircle,
  },
];

const kategoriPengajuan = [
  {
    content: "Judul Kerja Praktik",
    path: "/dashboard/request/suratpengajuan/kerjapraktik",
    type: "Judul Kerja Praktik",
    color: "button-green",
    icon: Briefcase,
  },
  {
    content: "Judul Skripsi",
    path: "/dashboard/request/suratpengajuan/judulskripsi",
    type: "Judul Skripsi",
    color: "button-yellow",
    icon: BookOpen,
  },
  {
    content: "Pengantar Kerja Praktik",
    path: "/dashboard/request/suratpengajuan/pengantar-kerja-praktik",
    type: "Pengantar Kerja Praktik",
    color: "button-blue",
    icon: ScrollText,
  },
];

const kategoriPenugasan = [
  {
    content: "Penugasan Dosen Pembimbing Kerja Praktik",
    path: "/dashboard/request/suratpenugasan/dosenkerjapraktik",
    type: "Penugasan Dosen Kerja Praktik",
    color: "button-green",
    icon: Users,
  },
  {
    content: "Penugasan Dosen Pembimbing Tugas Akhir/skripsi",
    path: "/dashboard/request/suratpenugasan/dosentugasakhir",
    type: "Penugasan Dosen Skripsi",
    color: "button-blue",
    icon: Users,
  },
];

// UI pengajuan
const pengajuanMahasiswaAktif = {
  syarat: [
    "Silahkan unduh berkas persyaratan untuk pengajuan",
    "Isi data-data yang dibutuhkan dalam surat tersebut",
    "Setelah data terisi, silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf lalu submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  url: "/suratKeterangan/mahasiswaAktif.pdf",
  title: "Surat keterangan mahasiswa aktif",
  fileName: "mahasiswaAktif.pdf",
};

const pengajuanCuti = {
  syarat: [
    "Silahkan unduh berkas persyaratan untuk pengajuan",
    "Isi data-data yang dibutuhkan dalam surat tersebut",
    "Masukan screenshoot rekap pembayaran di siakad sebagai page ke-2",
    "Masukan Scan KTM depan & belakang sebagai page ke-3 dan page ke-4",
    "Setelah selesai, silahkan isi informasi pengaju dengan benar",
    "Upload berkas diatas dalam bentuk pdf lalu submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  url: "/suratKeterangan/permohonanCuti.pdf",
  title: "Surat permohonan cuti",
  fileName: "pengajuanCuti.pdf",
};

export const penugasanDosenSkripsi = {
  syarat: [
    "Ajukan surat pengajuan judul skripsi terlebih dahulu jika belum ada",
    "Pastikan judul skripsi telah disetujui oleh dosen pembimbing, akademik dan prodi",
    "Setelah terisi silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf",
    "Pengajuan akan di tinjau oleh admin",
    "berkas akan dikirm melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: "Penugasan Dosen Pembimbing Tugas Akhir/Skripsi",
};

export const penugasanDosenKerjaPraktik = {
  syarat: [
    "Ajukan surat pengajuan judul kerja praktik terlebih dahulu jika belum ada",
    "Pastikan judul kerja praktik telah disetujui oleh dosen pembimbing, akademik dan prodi",
    "Setelah terisi silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf",
    "Pengajuan akan di tinjau oleh admin",
    "berkas akan dikirm melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: "Penugasan Dosen Pembimbing Tugas Akhir/Skripsi",
};

const keteranganLulus = {
  syarat: [
    "Isi informasi pengaju dengan benar",
    "Setelah terisi, silahkan submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: "Surat keterangan lulus",
};

const pengunduranDiri = {
  syarat: [
    "Silahkan unduh berkas persyaratan untuk pengajuan",
    "Isi data-data yang dibutuhkan dalam surat tersebut",
    "Setelah data terisi, silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf lalu submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  url: "/suratKeterangan/pengunduranDiri.pdf",
  title: "Surat pengunduran diri",
  fileName: "pengunduranDiri.pdf",
};

const judulKerjaPraktik = {
  syarat: [
    "Silahkan unduh berkas persyaratan untuk pengajuan",
    "Ajukan transkrip nilai terlebih dahulu jika tidak ada",
    "Isi data-data yang dibutuhkan dalam berkas tersebut dan masukan transkrip nilai",
    "Setelah data terisi, silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf lalu submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  url: "/suratPengajuan/Pengajuan_kp.pdf",
  title: "Judul kerja praktik",
  fileName: "judul_kp.pdf",
};

const judulSkripsi = {
  syarat: [
    "Ajukan transkrip nilai jika tidak ada",
    "Lampirkan juga BAB-1 TUGAS AKHIR dengan transkrip nilai dalam bentuk pdf",
    "Silahkan isi informasi pengaju dengan benar dan upload berkas yang dibutuhkan dan submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: "Judul skripsi",
};

const pengantarKp = {
  syarat: [
    "Silahkan unduh berkas persyaratan untuk pengajuan",
    "Ajukan transkrip nilai terlebih dahulu jika tidak ada",
    "Isi data-data yang dibutuhkan dalam berkas tersebut dan masukan transkrip nilai",
    "Setelah data terisi, silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf lalu submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: "Pengantar kerja praktik",
  url: "/suratPengajuan/pengantar_kp.pdf",
  fileName: "Pengantar_kp.pdf",
};

const transkripNilai = {
  syarat: [
    "Isi informasi pengaju dengan benar",
    "Setelah terisi, silahkan submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: "Transkrip nilai",
};

const yudisium = {
  syarat: [
    "Silahkan unduh berkas persyaratan untuk pengajuan",
    "Isi data-data yang dibutuhkan dalam surat tersebut",
    "Setelah data terisi, silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf lalu submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: "Yudisium",
  url: "/yudisium/yudisium.pdf",
  fileName: "yudisium.pdf",
};

export const STATUS_LABEL_USER = {
  submitted: 'Diajukan',
  pending: 'Diajukan',
  reviewing: 'Ditinjau',
  processing: 'Diproses',
  revision_required: 'Perlu Revisi',
  rejected: 'Ditolak',
  canceled: 'Dibatalkan',
  completed: 'Selesai',
};

export const STATUS_LABEL_ADMIN = {
  submitted: 'Masuk',
  pending: 'Masuk',
  reviewing: 'Verifikasi',
  processing: 'Pengerjaan',
  revision_required: 'Butuh Revisi',
  rejected: 'Ditolak',
  canceled: 'Dibatalkan',
  completed: 'Selesai',
};

export const ACTIVE_STATUSES = ['submitted', 'pending', 'reviewing', 'processing', 'revision_required'];

export {
  kategoriPermintaan,
  kategoriKeterangan,
  kategoriPengajuan,
  kategoriPenugasan,
  pengajuanMahasiswaAktif,
  pengajuanCuti,
  keteranganLulus,
  pengunduranDiri,
  judulKerjaPraktik,
  judulSkripsi,
  pengantarKp,
  transkripNilai,
  yudisium,
};
