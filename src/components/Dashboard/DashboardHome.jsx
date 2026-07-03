import { Link } from "react-router";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Users,
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
import { useUser } from "../../utils/hooks/userContext";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 11) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
};

const DashboardHome = () => {
  const { showToast } = useToast();
  const { userData } = useUser();
  const [historRequest, setHistoryRequest] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);

  const fetchData = async (p) => {
    setLoading(true);
    const userId = userData?.id;
    if (!userId) { setLoading(false); return; }
    const result = await getRequest(userId, p);
    if (result.status === "success") {
      setHistoryRequest(result.data);
      setPage(result.page);
      setTotalPage(result.totalPage);
      await getSummeryDataByUserId(setSummary, userId);
    } else {
      showToast(result.message || "Gagal mengambil data", "error");
    }
    setLoading(false);
  };

  const changePageHandler = (p) => fetchData(p);

  useEffect(() => {
    if (userData?.id) fetchData(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id]);

  const summaryValue = (label) =>
    summary.find((item) => item.label === label)?.value || 0;
  const totalRequest = summaryValue("Total Pengajuan");
  const successRequest = summaryValue("Selesai");
  const procesingRequest = summaryValue("Masuk") + summaryValue("Diproses");
  const rejectedRequest = summaryValue("Ditolak");

  const displayName = userData?.full_name || userData?.username || "Pengguna";

  return (
    <Motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
          },
        },
      }}
      className="space-y-6"
    >
      {/* Welcome Card */}
      <Motion.div
        variants={{
          hidden: { opacity: 0, y: -16 },
          visible: { opacity: 1, y: 0 },
        }}
        className="relative w-full rounded-[20px] overflow-hidden bg-gradient-to-r from-[#4318FF] to-[#7C5FFF] p-6 md:p-8 shadow-lg shadow-indigo-500/30"
      >
        {/* decorative orbs */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">{getGreeting()} 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{displayName}</h1>
            <p className="text-indigo-200 text-sm mt-2">Selamat datang di dashboard pengajuan surat.</p>
            {/* stat pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <FileText className="h-3 w-3" /> {totalRequest} Total
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Clock className="h-3 w-3" /> {procesingRequest} Diproses
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <CheckCircle className="h-3 w-3" /> {successRequest} Selesai
              </span>
            </div>
          </div>
          {/* avatar */}
          <div className="shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-lg overflow-hidden">
            {userData?.url_photo ? (
              <img src={userData.url_photo} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <Users className="h-8 w-8 md:h-10 md:w-10 text-white" />
            )}
          </div>
        </div>
      </Motion.div>

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
          value={totalRequest}
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
        <Card className="rounded-[20px] border-none shadow-sm overflow-hidden bg-white">
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
