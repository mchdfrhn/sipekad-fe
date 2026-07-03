import { motion } from "motion/react";
import { Link } from "react-router";
import { Users, FileText, Star } from "lucide-react";

export default function DemoSection() {
  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const waUrl = `https://wa.me/${waNumber}`;

  return (
    <section className="px-4 md:px-12 my-20 font-jakarta">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] px-8 py-20 text-center"
      >
        {/* Decorative orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Siap untuk memulai?
          </h2>
          <p className="text-white/80 text-lg max-w-lg">
            Daftar sekarang dan kelola pengajuan akademik Anda dengan lebih mudah.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              to="/register"
              className="px-7 py-3 rounded-xl bg-white text-[#4318FF] font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Daftar Sekarang
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Hubungi Kami
            </a>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <span className="flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
              <Users size={16} /> 500+ Mahasiswa
            </span>
            <span className="flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
              <FileText size={16} /> 1000+ Surat Diproses
            </span>
            <span className="flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
              <Star size={16} /> 99% Kepuasan
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
