import { Link } from "react-router";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getRequest } from "../../utils/api/request";
import StatsCard from "../admin/StatsCard";
import TableRiwayatUser from "./TableRiwayatUser";
import { Button } from "@/components/ui/button";
import { useToast } from "@/utils/hooks/useToast";
import DistribusiPengajuan from "../chart/DistribusiPengajuan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardHome = () => {
  const { showToast } = useToast();
  const [historRequest, setHistoryRequest] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const changePageHandler = async (p) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const result = await getRequest(user.id, p);
    if (result.status === "success") {
      setHistoryRequest(result.data);
      setPage(result.page);
      setTotalPage(result.totalPage);
    } else {
      showToast(result.message || "Gagal mengambil data", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    const getRequestHandler = async () => {
      setLoading(true);
      const user = localStorage.getItem("user");
      if (user) {
        const userId = JSON.parse(user).id;
        const result = await getRequest(userId);
        if (result.status === "success") {
          setHistoryRequest(result.data);
          setTotalPage(result.totalPage);
          setPage(result.page);
        } else {
          showToast(result.message || "Gagal mengambil data", "error");
        }
      }
      setLoading(false);
    };

    getRequestHandler();
  }, [page, showToast]);

  const totalRequest = historRequest.length;
  // Note: These counts might be only for the current page if the API is paginated.
  // Ideally, the API would return total counts for stats separately.
  // For now, consistent with previous implementation, we use what we have or placeholder if needed.
  // Previous implementation calculated from historyRequest which seemed to be paginated?
  // If getRequest returns paginated data, these counts are only for the current page.
  // But let's stick to the previous logic for now.
  const successRequest = historRequest.filter(
    (req) => req.status === "completed",
  ).length;
  const procesingRequest = historRequest.filter(
    (req) => req.status === "pending",
  ).length;
  const rejectedRequest = historRequest.filter(
    (req) => req.status === "canceled",
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pengajuan"
          value={totalRequest} // This might be incorrect if paginated, but keeping logic same as before
          icon={FileText}
          variant="premium"
        />
        <StatsCard
          title="Diproses"
          value={procesingRequest}
          icon={Clock}
          variant="orange"
        />
        <StatsCard
          title="Ditolak"
          value={rejectedRequest}
          icon={XCircle}
          variant="red"
        />
        <StatsCard
          title="Diterima"
          value={successRequest}
          icon={CheckCircle}
          variant="green"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6">
        <Card className="rounded-[30px] border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="px-8 pt-8 pb-0">
            <CardTitle className="text-lg font-bold text-[#2B3674]">
              Distribusi Pengajuan
            </CardTitle>
            <CardDescription className="text-sm font-medium text-gray-400">
              Statistik pengajuan surat dalam 7 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <DistribusiPengajuan />
          </CardContent>
        </Card>
      </div>

      {/* Recent Request Table */}
      <TableRiwayatUser
        historyRequest={historRequest}
        page={page}
        limit={10}
        isLoading={loading}
      />

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="flex justify-end items-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => changePageHandler(page - 1)}
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
                onClick={() => changePageHandler(pageNumber)}
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
            onClick={() => changePageHandler(page + 1)}
            disabled={page === totalPage}
            className="rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
