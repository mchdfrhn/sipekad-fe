import { ArrowLeft, ArrowRight, Send, Eye, Filter } from "lucide-react";
import { motion as Motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import { getAllRequestForAdmin } from "../../../utils/api/request";
import { Link, useSearchParams } from "react-router";
import { generatePaginationPages } from "@/utils/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/Loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RequestAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const limit = 15;
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);

  // Read initial status filter from URL params (e.g. coming from dashboard card click)
  const initialStatus = searchParams.get("status") || "default";

  // Filter States
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [filterType, setFilterType] = useState("default");

  const getRequests = useCallback(
    async (
      p = 1,
      status = filterStatus,
      type = filterType,
      search = searchTerm,
    ) => {
      setLoading(true);
      const requests = await getAllRequestForAdmin(
        p,
        limit,
        status,
        type,
        search,
      );
      if (requests.status === "success") {
        setRequests(requests.data);
        setPage(requests.page);
        setTotalPage(requests.totalPage);
      }
      setLoading(false);
    },
    [filterStatus, filterType, searchTerm, limit],
  );

  const handlePageChange = async (p) => {
    setPage(p);
    await getRequests(p, filterStatus, filterType, searchTerm);
  };

  const handleStatusChange = async (status) => {
    setFilterStatus(status);
    setPage(1); // Reset to page 1 on filter change
    await getRequests(1, status, filterType, searchTerm);
  };

  const handleTypeChange = async (type) => {
    setFilterType(type);
    setPage(1); // Reset to page 1 on filter change
    await getRequests(1, filterStatus, type, searchTerm);
  };

  useEffect(() => {
    getRequests(1);
  }, [getRequests]);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-0 shadow-lg rounded-[20px] bg-white h-full flex flex-col relative overflow-hidden"
    >
      <CardContent className="p-0 pb-6 flex-1 flex flex-col justify-between relative">
        {loading && <LoadingOverlay />}
        <TablePengajuan
          requests={requests}
          page={page}
          limit={limit}
          dontDisplayUsername={false}
          onStatusFilter={handleStatusChange}
          onTypeFilter={handleTypeChange}
          currentStatus={filterStatus}
          currentType={filterType}
        />

        {/* Pagination - Fixed at bottom */}
        {totalPage > 1 && (
          <div className="flex justify-center items-center gap-2 mt-auto pt-6 border-t border-gray-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            {generatePaginationPages(page, totalPage).map(
              (pageNumber, index) => {
                if (pageNumber === "..") {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="px-2 text-gray-400 font-bold"
                    >
                      ..
                    </span>
                  );
                }
                return (
                  <Button
                    key={pageNumber}
                    variant={page === pageNumber ? "default" : "ghost"}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`h-8 w-8 rounded-full p-0 text-xs font-bold ${
                      page === pageNumber
                        ? "bg-[#4318FF] text-white hover:bg-[#3311CC]"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </Button>
                );
              },
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPage}
              className="rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Motion.div>
  );
};

export const TablePengajuan = ({
  requests,
  page,
  limit,
  dontDisplayUsername,
  onStatusFilter,
  onTypeFilter,
  currentStatus,
  currentType,
}) => {
  const dataKey = [
    "No",
    "Nama Pemohon",
    "Jenis Surat",
    "Pesan",
    "Tanggal",
    "Status",
    "Aksi",
  ];

  // Calculate empty rows needed to maintain height
  const emptyRows = limit - requests.length;

  const typeOptions = [
    { label: "Semua Jenis", value: "default" },
    { label: "Mahasiswa Aktif", value: "Mahasiswa Aktif" },
    { label: "Keterangan Cuti", value: "Keterangan Cuti" },
    { label: "Keterangan Lulus", value: "Keterangan Lulus" },
    { label: "Pengunduran Diri", value: "Pengunduran Diri" },
    { label: "Transkrip Nilai", value: "Transkrip Nilai" },
    { label: "Surat Sempro", value: "Surat Sempro" },
    { label: "Seminar KP", value: "Seminar KP" },
    { label: "Sidang Skripsi", value: "Sidang Skripsi" },
    { label: "Yudisium", value: "Yudisium" },
    { label: "Judul Skripsi", value: "Judul Skripsi" },
    { label: "Judul Kerja Praktik", value: "Judul Kerja Praktik" },
    { label: "Pengantar Kerja Praktik", value: "Pengantar Kerja Praktik" },
    { label: "Penugasan Dosen Skripsi", value: "Penugasan Dosen Skripsi" },
    {
      label: "Penugasan Dosen Kerja Praktik",
      value: "Penugasan Dosen Kerja Praktik",
    },
  ];

  const statusOptions = [
    { label: "Semua Status", value: "default" },
    { label: "Pending", value: "pending" },
    { label: "Selesai", value: "completed" },
    { label: "Ditolak", value: "canceled" },
  ];

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-x-auto mt-4 px-4 md:px-0"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              No
            </th>
            {!dontDisplayUsername && (
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Nama Pemohon
              </th>
            )}
            <th className="px-6 py-3 text-left whitespace-nowrap">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#4318FF] focus:outline-none transition-colors cursor-pointer">
                  Jenis Surat <Filter className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-white max-h-[300px] overflow-y-auto border-none shadow-xl"
                >
                  {typeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => onTypeFilter && onTypeFilter(option.value)}
                      className={`cursor-pointer font-bold px-4 py-2 rounded-lg ${currentType === option.value ? "bg-indigo-50 text-[#4318FF]" : "text-[#2B3674] hover:bg-indigo-50 hover:text-[#4318FF]"}`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </th>
            <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Pesan
            </th>
            <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left whitespace-nowrap">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#4318FF] focus:outline-none transition-colors cursor-pointer">
                  Status <Filter className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-white border-none shadow-xl"
                >
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        onStatusFilter && onStatusFilter(option.value)
                      }
                      className={`cursor-pointer font-bold px-4 py-2 rounded-lg ${currentStatus === option.value ? "bg-indigo-50 text-[#4318FF]" : "text-[#2B3674] hover:bg-indigo-50 hover:text-[#4318FF]"}`}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {requests.length === 0 ? (
            <tr>
              <td colSpan={dataKey.length} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-gray-50 p-4 rounded-full">
                    <Send className="h-10 w-10 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold">
                    Tidak ada data pengajuan yang ditemukan
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            <>
              {requests.map((value, index) => (
                <Motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`group transition-colors border-b border-gray-50 last:border-0 hover:bg-blue-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-4 md:px-6 py-2.5 whitespace-nowrap">
                    <span className="text-xs md:text-sm font-bold text-[#2B3674]">
                      {(page - 1) * limit + index + 1}
                    </span>
                  </td>

                  {!dontDisplayUsername && (
                    <td className="px-4 md:px-6 py-2.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-6 w-6 md:h-8 md:w-8 shrink-0 border border-indigo-100">
                          <AvatarImage
                            src={value.url_photo}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-blue-100 text-[#4318FF] font-bold text-xs">
                            {value.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          to={`/admin/user/${value.user_id}`}
                          className="text-xs md:text-sm font-bold text-[#2B3674] hover:text-[#4318FF] transition-colors truncate max-w-[120px] md:max-w-none block"
                        >
                          {value.full_name}
                        </Link>
                      </div>
                    </td>
                  )}

                  <td className="px-4 md:px-6 py-2.5">
                    <span className="text-xs md:text-sm font-bold text-[#2B3674]">
                      {value.type}
                    </span>
                  </td>

                  <td className="hidden md:table-cell px-6 py-2.5 max-w-[300px]">
                    <span
                      className="text-sm text-gray-500 block truncate"
                      title={value.message}
                    >
                      {value.message}
                    </span>
                  </td>

                  <td className="hidden lg:table-cell px-6 py-2.5">
                    <span className="text-xs md:text-sm font-bold text-[#2B3674]">
                      {new Date(value.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  <td className="px-4 md:px-6 py-2.5 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] md:text-[11px] font-bold capitalize
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

                  <td className="px-4 md:px-6 py-2.5">
                    <div className="flex justify-center">
                      <Link to={`/admin/pengajuan/${value.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 md:h-8 md:w-8 rounded-xl transition-all ${
                            value.status === "pending"
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          }`}
                        >
                          {value.status === "pending" ? (
                            <Send className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </Link>
                    </div>
                  </td>
                </Motion.tr>
              ))}
              {/* Render Empty Rows to maintain height */}
              {emptyRows > 0 &&
                [...Array(emptyRows)].map((_, i) => (
                  <tr
                    key={`empty-${i}`}
                    className="border-b border-gray-50 last:border-0 h-[48px]"
                  >
                    <td
                      colSpan={dataKey.length}
                      className="px-4 md:px-6 py-2.5 whitespace-nowrap"
                    >
                      &nbsp;
                    </td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </Motion.div>
  );
};

export default RequestAdmin;
