import { motion } from "motion/react";
import { Link } from "react-router";
import { FileText, Bell, Download } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Pengajuan Online",
    desc: "Ajukan surat keterangan, transkrip, dan dokumen akademik dari mana saja",
    to: "/login",
  },
  {
    icon: Bell,
    title: "Status Real-time",
    desc: "Pantau status pengajuan Anda secara langsung dan terima notifikasi otomatis",
    to: "/login",
  },
  {
    icon: Download,
    title: "Dokumen Digital",
    desc: "Unduh dokumen yang telah disetujui langsung dari dashboard Anda",
    to: "/login",
  },
];

export default function ListSection() {
  return (
    <section id="features" className="bg-[#F4F7FE] py-24 px-6 font-jakarta">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2B3674] mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Semua yang Anda butuhkan untuk mengelola dokumen akademik tersedia dalam satu platform.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc, to }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to={to}
                className="block bg-white border border-gray-100 rounded-[20px] p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6">
                  <Icon size={28} className="text-[#4318FF]" />
                </div>
                <h3 className="text-[#2B3674] font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
