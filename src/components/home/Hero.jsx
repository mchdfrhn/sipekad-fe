import { motion } from "motion/react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

const STATS = [
  { label: "4 Jenis Surat" },
  { label: "Proses Cepat" },
  { label: "100% Digital" },
];

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white font-jakarta">
      {/* Background blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#4318FF] opacity-[0.06] blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-[#7C5FFF] opacity-[0.06] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-400 opacity-[0.05] blur-3xl" />
      </div>

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src="/sttimage.png" alt="Logo SIPEKAD" className="h-8 w-auto" />
          <span className="text-[#2B3674] font-bold text-lg tracking-wide">SIPEKAD</span>
        </div>
        <Link
          to="/login"
          className="px-5 py-2 rounded-xl bg-[#4318FF] text-white text-sm font-semibold hover:bg-[#3512d6] transition-colors"
        >
          Masuk
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center pt-20">
        <div className="max-w-7xl mx-auto w-full px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#4318FF] text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-[#4318FF] animate-pulse" />
              Sistem Akademik Digital
            </span>

            {/* H1 */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2B3674] leading-tight">
              Kelola Pengajuan
              <br />
              Akademikmu
              <br />
              <span className="bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] bg-clip-text text-transparent">
                dengan Mudah
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              Platform digital untuk mengajukan dokumen akademik, memantau status, dan mengunduh dokumen—kapan saja, di mana saja.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4318FF] text-white font-semibold hover:bg-[#3512d6] transition-colors shadow-lg shadow-indigo-200"
              >
                Mulai Sekarang
                <ChevronRight size={18} />
              </Link>
              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-[#2B3674] font-semibold hover:border-[#4318FF] hover:text-[#4318FF] transition-colors"
              >
                Pelajari Lebih
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#4318FF]" />
                  <span className="text-[#2B3674] font-semibold text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            {/* Cap image */}
            <motion.img
              src="/assets/3d-cap.png"
              alt="Topi wisuda 3D"
              className="absolute -top-6 right-8 w-20 h-20 object-contain z-10"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />

            {/* Student image floating */}
            <motion.img
              src="/assets/3d-student.png"
              alt="Ilustrasi mahasiswa 3D"
              className="relative w-full max-w-sm lg:max-w-md object-contain drop-shadow-2xl"
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />

            {/* Subtle glow behind image */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-40 blur-3xl -z-10"
            />
          </motion.div>
        </div>
      </main>
    </section>
  );
}
