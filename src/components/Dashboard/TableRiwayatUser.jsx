import { Link } from "react-router";
import { Send, Eye } from "lucide-react";
import { STATUS_LABEL_USER } from "../../utils/constant";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/Loading";
import { motion as Motion } from "motion/react";

const dotColor = (status) => {
  const map = {
    submitted: "bg-blue-500",
    pending: "bg-blue-500",
    reviewing: "bg-purple-500",
    processing: "bg-teal-500",
    revision_required: "bg-orange-500",
    rejected: "bg-red-500",
    canceled: "bg-red-500",
    completed: "bg-green-500",
  };
  return map[status] || "bg-gray-400";
};

const userStatusBadgeClass = (status) => {
  const map = {
    submitted: "bg-blue-50 text-blue-600 border-blue-100",
    pending:   "bg-blue-50 text-blue-600 border-blue-100",
    reviewing: "bg-purple-50 text-purple-600 border-purple-100",
    processing: "bg-teal-50 text-teal-600 border-teal-100",
    revision_required: "bg-orange-50 text-orange-600 border-orange-100",
    rejected:  "bg-red-50 text-red-600 border-red-100",
    canceled:  "bg-red-50 text-red-600 border-red-100",
    completed: "bg-green-50 text-green-600 border-green-100",
  };
  return map[status] || "bg-gray-50 text-gray-600 border-gray-100";
};

const TableRiwayatUser = ({ historyRequest, page, limit = 10, isLoading }) => {
  const colCount = 5; // No, Jenis Surat, Tanggal, Status, Aksi

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden mt-4 premium-card relative min-h-[500px]"
    >
      <div className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-6 pb-4">
        <h2 className="text-xl font-bold text-[#2B3674]">Riwayat Pengajuan</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white border-b border-gray-100 z-10">
            <tr>
              {["No", "Jenis Surat", "Tanggal", "Status", "Aksi"].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ${h === "Status" || h === "Aksi" ? "text-center" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={colCount} className="p-0">
                  <TableSkeleton rows={limit} cols={colCount} />
                </td>
              </tr>
            ) : historyRequest.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-indigo-50 p-4 rounded-full">
                      <Send className="h-10 w-10 text-indigo-300" />
                    </div>
                    <p className="text-gray-500 font-bold">Tidak ada riwayat pengajuan</p>
                    <p className="text-gray-400 text-sm">Belum ada surat yang diajukan</p>
                    <Link to="/dashboard/request">
                      <Button className="mt-2 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl px-5 text-sm font-semibold shadow shadow-indigo-400/30">
                        Buat Pengajuan
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {historyRequest.map((value, index) => (
                  <Motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`group transition-colors border-b border-gray-50 last:border-0 hover:bg-indigo-50/40 ${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs md:text-sm font-bold text-[#2B3674]">
                        {index + 1 + (page - 1) * limit}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <Link to={`/dashboard/${value.id}`} className="text-xs md:text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-all">
                        {value.type}
                      </Link>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs md:text-sm font-bold text-[#2B3674]">
                        {new Date(value.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "2-digit",
                        })}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] md:text-[11px] font-bold border ${userStatusBadgeClass(value.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColor(value.status)}`} />
                        {STATUS_LABEL_USER[value.status] || value.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Link to={`/dashboard/${value.id}`}>
                        <button type="button" className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    </td>
                  </Motion.tr>
                ))}
                {limit - historyRequest.length > 0 &&
                  [...Array(limit - historyRequest.length)].map((_, i) => (
                    <tr key={`empty-${i}`} className="h-[48px]">
                      <td colSpan={colCount}>&nbsp;</td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </Motion.div>
  );
};

export default TableRiwayatUser;
