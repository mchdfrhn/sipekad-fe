// Route pengajuan
const kategoriPermintaan = [
  {
    content: "Surat Keterangan",
    path: "/dashboard/request/suratketerangan",
    color: "button-yellow",
  },
  {
    content: "Surat Pengajuan",
    path: "/dashboard/request/suratpengajuan",
    color: "button-green",
  },
  {
    content: "Surat Penugasan",
    path: "/dashboard/request/suratpenugasan",
    color: "button-blue",
  },
  {
    content: "Transkrip Nilai",
    path: "/dashboard/request/transkripnilai",
    color: "button-orange",
  },
  {
    content: "Permohonan Yudisium",
    path: "/dashboard/request/yudisium",
    color: "button-gray",
  },
  {
    content: "Pengajuan Sempro",
    path: "/dashboard/request/pengajuansempro",
    color: "button-red",
  },
  {
    content: "Pengajuan Seminar Kp",
    path: "/dashboard/request/seminarkp",
    color: "button-teal",
  },
  {
    content: "Pengajuan Sidang Skripsi",
    path: "/dashboard/request/skripsi",
    color: "button-violet",
  },
];

export const STUDENT_PRODI = {
    TEKNIK_INFORMATIKA: "teknik informatika",
    TEKNIK_LINGKUNGAN: "teknik lingkungan",
    TEKNIK_SIPIL: "teknik sipil"
}

export const USER_ROLE = {
    USER_REGULAR: "user",
    USER_ADMIN: "admin"
}

const kategoriKeterangan = [
  {
    content: "Keterangan Mahasiswa Aktif",
    path: "/dashboard/request/suratketerangan/mahasiswaaktif",
    color: "button-green",
  },
  {
    content: "Keterangan Cuti",
    path: "/dashboard/request/suratKeterangan/cuti",
    color: "button-gray",
  },
  {
    content: "Keterangan Lulus",
    path: "/dashboard/request/suratketerangan/keteranganlulus",
    color: "button-blue",
  },
  {
    content: "Pengunduran Diri",
    path: "/dashboard/request/suratketerangan/pengundurandiri",
    color: "button-red",
  },
];

const kategoriPengajuan = [
  {
    content: "Judul Kerja Praktik",
    path: "/dashboard/request/suratpengajuan/kerjapraktik",
    color: "button-green",
  },
  {
    content: "Judul Skripsi",
    path: "/dashboard/request/suratpengajuan/judulskripsi",
    color: "button-yellow",
  },
  {
    content: "Pengantar Kerja Praktik",
    path: "/dashboard/request/suratpengajuan/pengantar-kerja-praktik",
    color: "button-blue",
  },
];

const kategoriPenugasan = [
  {
    content: "Penugasan Dosen Pembimbing Kerja Praktik",
    path: "/dashboard/request/suratpenugasan/dosenkerjapraktik",
    color: "button-green",
  },
  {
    content: "Penugasan Dosen Pembimbing Tugas Akhir/skripsi",
    path: "/dashboard/request/suratpenugasan/dosentugasakhir",
    color: "button-blue",
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
    "berkas akan dikirm melalui aplikasi ini, karena itu silahkan cek secara berkala"
  ],
  title: 'Penugasan Dosen Pembimbing Tugas Akhir/Skripsi'
}

export const penugasanDosenKerjaPraktik = {
  syarat: [
    "Ajukan surat pengajuan judul kerja praktik terlebih dahulu jika belum ada",
    "Pastikan judul kerja praktik telah disetujui oleh dosen pembimbing, akademik dan prodi",
    "Setelah terisi silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf",
    "Pengajuan akan di tinjau oleh admin",
    "berkas akan dikirm melalui aplikasi ini, karena itu silahkan cek secara berkala"
  ],
  title: 'Penugasan Dosen Pembimbing Tugas Akhir/Skripsi'
}

const keteranganLulus = {
  syarat: [
    "Isi informasi pengaju dengan benar",
    "Setelah terisi, silahkan submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: 'Surat keterangan lulus'
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
  url: '/suratKeterangan/pengunduranDiri.pdf',
  title: 'Surat pengunduran diri',
  fileName: 'pengunduranDiri.pdf'
}

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
  url: '/suratPengajuan/Pengajuan_kp.pdf',
  title: 'Judul kerja praktik',
  fileName: 'judul_kp.pdf'
}

const judulSkripsi = {
  syarat: [
    "Ajukan transkrip nilai jika tidak ada",
    "Lampirkan juga BAB-1 TUGAS AKHIR dengan transkrip nilai dalam bentuk pdf",
    "Silahkan isi informasi pengaju dengan benar dan upload berkas yang dibutuhkan dan submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: 'Judul skripsi'
}

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
  title: 'Pengantar kerja praktik',
  url: '/suratPengajuan/pengantar_kp.pdf',
  fileName: 'Pengantar_kp.pdf'
}

const transkripNilai = {
   syarat: [
    "Isi informasi pengaju dengan benar",
    "Setelah terisi, silahkan submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: 'Transkrip nilai'
}

const yudisium = {
  syarat: [
    "Silahkan unduh berkas persyaratan untuk pengajuan",
    "Isi data-data yang dibutuhkan dalam surat tersebut",
    "Setelah data terisi, silahkan isi informasi pengaju dengan benar",
    "Upload berkas persyaratan dengan format pdf lalu submit",
    "Pengajuan anda akan di tinjau oleh admin",
    "Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala",
  ],
  title: 'Yudisium',
  url: '/yudisium/yudisium.pdf',
  fileName: 'yudisium.pdf'
}

const sempro = {
  syarat: [
    'Silahkan unduh berkas persayaratan untuk pengajuan',
    'Isi data-data yang dibutuhkan dalam surat tersebut',
    'Ajukan transkrip nilai jika tidak ada',
    'Screenshoot rekap pembayaran seminar skripsi melalui SIAKAD',
    'Masukan penugasan dosen skripsi/tugas akhir',
    'Masukan sisa persayaratan administrasi daftar seminar tugas akhir',
    'Upload semua berkas dalam satu file pdf',
    'Buku sidang skripsi 3 jilid (Bab 1 - 3)',
    'Pengajuan anda akan ditinjau oleh admin',
    'Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala'
  ],
  title: 'Sempro',
  url: '/sempro/sempro.pdf',
  fileName: 'sempro.pdf'
}

const seminarKerjaPraktik = {
  syarat: [
    'Silahkan unduh berkas persayaratan untuk pengajuan',
    'Isi data-data yang dibutuhkan dalam surat tersebut',
    'Ajukan transkrip nilai jika tidak ada',
    'Screenshoot rekap pembayaran seminar KP melalui SIAKAD',
    'Masukan penugasan dosen skripsi/tugas akhir',
    'Masukan sisa persayaratan administrasi daftar seminar tugas akhir',
    'Upload semua berkas dalam satu file pdf',
    'Buku laporan KP 2 jilid',
    'Pengajuan anda akan ditinjau oleh admin',
    'Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala'
  ],
  title: 'Seminar Kerja Praktik',
  url: '/sempro/sempro.pdf',
  fileName: 'Seminar_kerja_praktik.pdf'
}

const sidangSkripsi = {
  syarat: [
    'Silahkan unduh berkas persayaratan untuk pengajuan',
    'Isi data-data yang dibutuhkan dalam surat tersebut',
    'Ajukan transkrip nilai jika tidak ada',
    'Screenshoot rekap pembayaran sidangg skripsi melalui SIAKAD',
    'Masukan penugasan dosen skripsi/tugas akhir',
    'Masukan sisa persayaratan administrasi daftar seminar tugas akhir',
    'Upload semua berkas dalam satu file pdf',
    'Buku laporan KP 2 jilid',
    'Pengajuan anda akan ditinjau oleh admin',
    'Berkas akan dikirim melalui aplikasi ini, karena itu silahkan cek secara berkala'
  ],
  title: 'Sidang skripsi',
  url: '/sempro/sempro.pdf',
  fileName: 'Seminar_kerja_praktik.pdf'
}


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
  sempro,
  seminarKerjaPraktik,
  sidangSkripsi,
};
