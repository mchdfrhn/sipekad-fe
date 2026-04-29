import { Link } from "react-router";
import { Send, Eye } from "lucide-react";
import { STATUS_LABEL_USER } from "../../utils/constant";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/Loading";
import { motion as Motion } from "motion/react";

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
  const dataKey = ["No", "Jenis Surat", "Tanggal", "Status"];

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-hidden mt-4 bg-white rounded-[20px] shadow-lg p-4 md:p-6 relative min-h-[500px]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#2B3674]">Riwayat Pengajuan</h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-3 text-left text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              No
            </th>
            <th className="px-4 py-3 text-left text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Jenis Surat
            </th>
            <th className="px-4 py-3 text-left text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Tanggal
            </th>
            <th className="px-4 py-3 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {isLoading ? (
            <tr>
              <td colSpan={dataKey.length} className="p-0">
                <TableSkeleton rows={limit} cols={dataKey.length} />
              </td>
            </tr>
          ) : historyRequest.length === 0 ? (
            <tr>
              <td colSpan={dataKey.length} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-gray-50 p-4 rounded-full">
                    <Send className="h-10 w-10 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold">
                    Tidak ada riwayat pengajuan
                  </p>
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
                  className={`group transition-colors border-b border-gray-50 last:border-0 hover:bg-indigo-50/50 ${
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
                      {new Date(value.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "2-digit",
                      })}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[11px] font-bold border ${userStatusBadgeClass(value.status)}`}>
                      {STATUS_LABEL_USER[value.status] || value.status}
                    </span>
                  </td>
                </Motion.tr>
              ))}
              {/* Fill remaining space with empty rows to maintain height consistency */}
              {limit - historyRequest.length > 0 &&
                [...Array(limit - historyRequest.length)].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-[48px]">
                    <td colSpan={dataKey.length}>&nbsp;</td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </Motion.div>
  );
};

export default TableRiwayatUser;
