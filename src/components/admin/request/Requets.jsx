import { ArrowLeft, ArrowRight, Send, Eye, Filter } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { getAllRequestForAdmin } from "../../../utils/api/request";
import { Link, useSearchParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RequestAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const limit = 15;
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";

  // Filter States
  const [filterStatus, setFilterStatus] = useState("default");
  const [filterType, setFilterType] = useState("default");

  const getRequests = useCallback(
    async (
      p = 1,
      status = filterStatus,
      type = filterType,
      search = searchTerm,
    ) => {
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
    <Card className="border-0 shadow-lg rounded-[20px] bg-white h-full flex flex-col">
      <CardContent className="p-0 pb-6 flex-1 flex flex-col justify-between">
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

            {[...Array(totalPage)].map((_, index) => {
              const pageNumber = index + 1;
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
            })}

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
    </Card>
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

  // Based on strings found in user request components
  const typeOptions = [
    { label: "Semua Jenis", value: "default" },
    { label: "Mahasiswa Aktif", value: "Mahasiswa Aktif" },
    { label: "Keterangan Cuti", value: "Keterangan Cuti" },
    { label: "Keterangan Lulus", value: "Keterangan lulus" },
    { label: "Pengunduran Diri", value: "Pengunduran diri" },
    { label: "Transkrip Nilai", value: "Transkrip nilai" },
    { label: "Surat Sempro", value: "Surat Sempro" },
    { label: "Seminar KP", value: "Seminar Kp" },
    { label: "Sidang Skripsi", value: "Sidang skripsi" },
    { label: "Yudisium", value: "yudisium" },
    { label: "Judul Skripsi", value: "Judul Skripsi" },
    { label: "Judul Kerja Praktik", value: "Judul Kerja Praktik" },
    { label: "Pengantar Kerja Praktik", value: "Pengantar Kerja Praktik" },
    { label: "Penugasan Dosen (KP/Skripsi)", value: "Penugasan Dosen skripsi" },
  ];

  const statusOptions = [
    { label: "Semua Status", value: "default" },
    { label: "Pending", value: "pending" },
    { label: "Selesai", value: "completed" },
    { label: "Ditolak", value: "canceled" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {dataKey.map((header) => {
              if (dontDisplayUsername && header === "Nama Pemohon") return null;

              if (header === "Jenis Surat") {
                return (
                  <th key={header} className="px-6 py-3 text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#4318FF] focus:outline-none transition-colors">
                        {header} <Filter className="h-3 w-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="bg-white max-h-[300px] overflow-y-auto border-none shadow-xl"
                      >
                        {typeOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() =>
                              onTypeFilter && onTypeFilter(option.value)
                            }
                            className={`cursor-pointer ${currentType === option.value ? "bg-blue-50 text-[#4318FF]" : ""}`}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </th>
                );
              }

              if (header === "Status") {
                return (
                  <th key={header} className="px-6 py-3 text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#4318FF] focus:outline-none transition-colors">
                        {header} <Filter className="h-3 w-3" />
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
                            className={`cursor-pointer ${currentStatus === option.value ? "bg-blue-50 text-[#4318FF]" : ""}`}
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </th>
                );
              }

              return (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td
                colSpan={dataKey.length}
                className="px-6 py-8 text-center text-gray-500 text-sm"
              >
                Tidak ada data pengajuan yang ditemukan.
              </td>
            </tr>
          ) : (
            <>
              {requests.map((value, index) => (
                <tr
                  key={index}
                  className={`group transition-colors border-b border-gray-50 last:border-0 hover:bg-blue-50/50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-2.5 whitespace-nowrap">
                    {/* Updated indexing logic: (page - 1) * limit + mapped index + 1 */}
                    <span className="text-sm font-bold text-[#2B3674]">
                      {(page - 1) * limit + index + 1}
                    </span>
                  </td>

                  {!dontDisplayUsername && (
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#4318FF] font-bold text-xs">
                          {value.full_name?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm font-bold text-[#2B3674]">
                          {value.full_name}
                        </span>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-2.5 whitespace-nowrap">
                    <span className="text-sm font-bold text-[#2B3674]">
                      {value.type}
                    </span>
                  </td>

                  <td className="px-6 py-2.5 whitespace-nowrap max-w-[300px]">
                    <span
                      className="text-sm text-gray-600 block truncate"
                      title={value.message}
                    >
                      {value.message}
                    </span>
                  </td>

                  <td className="px-6 py-2.5 whitespace-nowrap">
                    <span className="text-sm font-bold text-[#2B3674]">
                      {new Date(value.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  <td className="px-6 py-2.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                        ${
                          value.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : value.status === "pending"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-red-100 text-red-600"
                        }`}
                    >
                      {value.status === "completed"
                        ? "Selesai"
                        : value.status === "pending"
                          ? "Menunggu"
                          : "Ditolak"}
                    </span>
                  </td>

                  <td className="px-6 py-2.5 whitespace-nowrap">
                    <Link to={`/admin/pengajuan/${value.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-lg ${
                          value.status === "pending"
                            ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
                        }`}
                      >
                        {value.status === "pending" ? (
                          <Send className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {/* Render Empty Rows to maintain height */}
              {emptyRows > 0 &&
                [...Array(emptyRows)].map((_, i) => (
                  <tr
                    key={`empty-${i}`}
                    className="border-b border-gray-50 last:border-0 h-[48px]"
                  >
                    {" "}
                    {/* Approximate height of a row with content */}
                    {dataKey.map((_, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Move non-component exports if necessary to resolve Fast Refresh warnings
// Currently, RequestAdmin is the main export.

export default RequestAdmin;
