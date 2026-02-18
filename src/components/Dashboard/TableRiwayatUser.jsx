import { Link } from "react-router";
import { Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/Loading";

const TableRiwayatUser = ({ historyRequest, page, limit = 10, isLoading }) => {
  const dataKey = ["No", "Jenis Surat", "Pesan", "Tanggal", "Status", "Aksi"];

  return (
    <div className="w-full overflow-x-auto mt-4 bg-white rounded-[20px] shadow-lg p-6 relative min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#2B3674]">Riwayat Pengajuan</h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Jenis Surat
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Pesan
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Aksi
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
                <tr
                  key={index}
                  className={`group transition-colors border-b border-gray-50 last:border-0 hover:bg-indigo-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/20"
                  }`}
                >
                  <td className="px-6 py-2.5 whitespace-nowrap">
                    <span className="text-sm font-bold text-[#2B3674]">
                      {index + 1 + (page - 1) * limit}
                    </span>
                  </td>

                  <td className="px-6 py-2.5">
                    <span className="text-sm font-bold text-[#2B3674]">
                      {value.type}
                    </span>
                  </td>

                  <td className="px-6 py-2.5 max-w-[300px]">
                    <span
                      className="text-sm text-gray-500 block truncate"
                      title={value.message}
                    >
                      {value.message}
                    </span>
                  </td>

                  <td className="px-6 py-2.5">
                    <span className="text-sm font-bold text-[#2B3674]">
                      {new Date(value.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  <td className="px-6 py-2.5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold capitalize
                        ${
                          value.status === "completed"
                            ? "bg-green-50 text-green-600"
                            : value.status === "pending"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-red-50 text-red-600"
                        }`}
                    >
                      {value.status === "completed"
                        ? "Selesai"
                        : value.status === "pending"
                          ? "Menunggu"
                          : "Ditolak"}
                    </span>
                  </td>

                  <td className="px-6 py-2.5">
                    <div className="flex justify-center">
                      <Link to={`/dashboard/${value.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Fill remaining space with empty rows to maintain height consistency */}
              {limit - historyRequest.length > 0 &&
                [...Array(limit - historyRequest.length)].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-[48px]">
                    <td colSpan={6}>&nbsp;</td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableRiwayatUser;
