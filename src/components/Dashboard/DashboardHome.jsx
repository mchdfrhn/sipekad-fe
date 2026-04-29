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
import { getSummeryDataByUserId } from "../../utils/api/dashboardValue";
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
import { generatePaginationPages } from "../../utils/helpers";
import { motion as Motion } from "motion/react";

const DashboardHome = () => {
  const { showToast } = useToast();
  const [historRequest, setHistoryRequest] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);

  const changePageHandler = async (p) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const result = await getRequest(user.id, p);
    if (result.status === "success") {
      setHistoryRequest(result.data);
      setPage(result.page);
      setTotalPage(result.totalPage);
      await getSummeryDataByUserId(setSummary, user.id);
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
          await getSummeryDataByUserId(setSummary, userId);
        } else {
          showToast(result.message || "Gagal mengambil data", "error");
        }
      }
      setLoading(false);
    };

    getRequestHandler();
  }, [page, showToast]);

  const summaryValue = (label) =>
    summary.find((item) => item.label === label)?.value || 0;
  const totalRequest = summaryValue("Total Pengajuan");
  const successRequest = summaryValue("Selesai");
  const procesingRequest = summaryValue("Masuk") + summaryValue("Diproses");
  const rejectedRequest = summaryValue("Ditolak");

  return (
    <Motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2, // Increased for a more deliberate feel
            delayChildren: 0.1,
          },
        },
      }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <Motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
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
      </Motion.div>

      {/* Charts Section */}
      <Motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: {
              duration: 1,
              ease: "easeOut"
            }
          },
        }}
        className="grid gap-6"
      >
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
            <div className="h-[300px] w-full min-h-[300px]">
              <DistribusiPengajuan days={7} />
            </div>
          </CardContent>
        </Card>
      </Motion.div>

      {/* Recent Request Table */}
      <Motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <TableRiwayatUser
          historyRequest={historRequest}
          page={page}
          limit={10}
          isLoading={loading}
        />
      </Motion.div>

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

          {generatePaginationPages(page, totalPage).map((pageNumber, index) => {
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
    </Motion.div>
  );
};

export default DashboardHome;
