import Underline from "./Underline";
import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { STATUS_LABEL_USER } from "../../utils/constant";

const tableRiwayatDotClass = (status) => {
  const map = {
    submitted: "bg-blue-400",
    pending:   "bg-blue-400",
    reviewing: "bg-purple-400",
    processing: "bg-teal-400",
    revision_required: "bg-orange-400",
    rejected:  "bg-red-500",
    canceled:  "bg-red-500",
    completed: "bg-green-500",
  };
  return map[status] || "bg-gray-400";
};

const TableRiwayat = ({ historyRequest }) => {
  const propertyTable = ["No", "Jenis", "Tanggal", "Status"];
  return (
    <>
      <h1 className="text-xl font-semibold text-slate-800">
        Riwayat Pengajuan
      </h1>
      <Underline />
      <div className="flex flex-wrap items-center mb-6 gap-4 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="size-2 md:size-3 block bg-blue-400 rounded-full"></span>
          <p>: diajukan</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 md:size-3 block bg-purple-400 rounded-full"></span>
          <p>: ditinjau</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 md:size-3 block bg-teal-400 rounded-full"></span>
          <p>: diproses</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 md:size-3 block bg-orange-400 rounded-full"></span>
          <p>: perlu revisi</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 md:size-3 block bg-red-500 rounded-full"></span>
          <p>: ditolak</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 md:size-3 block bg-green-500 rounded-full"></span>
          <p>: selesai</p>
        </div>
      </div>
      <Motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5, ease: ["easeInOut"] }}
        className="rounded-lg bg-white overflow-hidden shadow-xl"
      >
        <div className="px-2 md:py-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {propertyTable.map((prop, index) => (
                  <th
                    key={prop}
                    className={`px-3 md:px-6 py-2 md:py-4 text-left text-xs md:text-sm font-semibold uppercase tracking-wide ${index === 0 ? "w-12 text-center" : ""}`}
                  >
                    {prop}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyRequest.map((value, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50/50" : "bg-white"} hover:bg-indigo-50/30 transition-colors border-b border-gray-100 last:border-0`}
                >
                  <td className="px-3 md:px-6 py-3 text-left text-xs md:text-base font-medium text-gray-600 w-12 text-center">
                    {value.queue}
                  </td>
                  <td className="px-3 md:px-6 py-3 text-left text-xs md:text-base font-bold text-indigo-600">
                    <Link to={`/dashboard/${value.id}`} className="hover:underline">
                      {value.type}
                    </Link>
                  </td>
                  <td className="px-3 md:px-6 py-3 text-left text-xs md:text-base font-medium text-gray-600">
                    {new Date(value.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-3 md:px-6 py-3 text-center">
                    <div className="flex justify-center">
                      <span
                        className={`size-2 md:size-3 rounded-full shadow-sm ring-2 ring-white ${tableRiwayatDotClass(value.status)}`}
                        title={STATUS_LABEL_USER[value.status] || value.status}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Motion.div>
    </>
  );
};

export default TableRiwayat;
