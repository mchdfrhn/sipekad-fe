import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  X,
  FileText,
  Calendar,
  MessageSquare,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import IframeRequest from "../admin/request/IframeRequest";
import { getRequestDetail } from "../../utils/api/request";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/Loading";
import { motion as Motion } from "motion/react";

const RequestDetailUser = () => {
  const [responses, setResponse] = useState([]);
  const [data, setData] = useState(null);
  const [showFrameResponse, setShowFrameResponse] = useState(false);
  const [showFrameRequest, setShowFrameRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const getRequestDetailForUser = async () => {
      setIsLoading(true);
      try {
        await getRequestDetail(id, setData, setResponse);
      } catch (error) {
        console.error("Failed to fetch request detail:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getRequestDetailForUser();
  }, [id]);

  const handleDownload = () => {
    if (!data?.url) return;
    const link = document.createElement("a");
    link.href = data.url;
    link.download = `${data.full_name || "berkas"}-${data.queue || "request"}.pdf`;
    link.click();
  };

  const response = responses[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 text-green-600 text-xs font-bold ring-1 ring-inset ring-green-600/10">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Selesai
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-xs font-bold ring-1 ring-inset ring-orange-600/10">
            <Clock className="h-3.5 w-3.5" />
            Menunggu
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold ring-1 ring-inset ring-red-600/10">
            <XCircle className="h-3.5 w-3.5" />
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold ring-1 ring-inset ring-gray-600/10">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 relative min-h-[400px]">
      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-[#4318FF] transition-colors group"
        >
          <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm">Kembali ke Dashboard</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - Pengajuan */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-[#2B3674] flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#4318FF]" />
                  Detail Pengajuan
                </CardTitle>
                {data && getStatusBadge(data.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Tanggal Pengajuan
                  </p>
                  <p className="text-base font-bold text-[#2B3674]">
                    {data?.updated_at
                      ? new Date(data.updated_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" /> Jenis Pengajuan
                  </p>
                  <p className="text-base font-bold text-[#2B3674]">
                    {data?.type || "-"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Pesan / Keterangan
                </p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                  "{data?.message || "Tidak ada pesan"}"
                </div>
              </div>

              {data?.url && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50">
                  <Button
                    onClick={() => setShowFrameRequest(true)}
                    variant="outline"
                    className="rounded-xl px-6 font-bold flex items-center gap-2 border-gray-100 text-[#2B3674] hover:bg-gray-50 shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                    Lihat Berkas
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 font-bold flex items-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <Download className="h-4 w-4" />
                    Unduh Berkas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Response */}
        <div className="lg:col-span-4">
          <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white overflow-hidden h-full">
            <CardHeader className="bg-[#4318FF]/5 pb-6">
              <CardTitle className="text-xl font-bold text-[#2B3674] flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#4318FF]" />
                Tanggapan Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              {responses?.length < 1 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-gray-50 mb-4">
                    <Clock className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-gray-400">
                    Belum ada tanggapan
                  </p>
                  <p className="text-xs text-gray-400 mt-1 px-4">
                    Admin akan segera meninjau pengajuan Anda
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Status Terakhir
                    </p>
                    <div className="pt-1">
                      {getStatusBadge(response?.status)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Pesan Admin
                    </p>
                    <p className="text-sm font-bold text-[#2B3674] bg-[#F4F7FE] p-4 rounded-2xl border border-indigo-50">
                      {response?.message || "-"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Tanggal Tanggapan
                    </p>
                    <p className="text-sm font-bold text-[#2B3674]">
                      {new Date(response?.updated_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  {response?.url && (
                    <Button
                      onClick={() => setShowFrameResponse(true)}
                      className="w-full bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl py-6 font-bold shadow-lg shadow-indigo-500/20"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Berkas Tanggapan
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Modals */}
      {(showFrameRequest || showFrameResponse) && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setShowFrameRequest(false);
            setShowFrameResponse(false);
          }}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[30px] border-none shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowFrameRequest(false);
                  setShowFrameResponse(false);
                }}
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#2B3674] transition-all"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-1 h-full min-h-[500px]">
              <IframeRequest
                url={showFrameRequest ? data?.url : response?.url}
                className="w-full h-[600px] border-none rounded-[25px]"
              />
            </div>
          </Card>
        </Motion.div>
      )}
    </div>
  );
};

export default RequestDetailUser;
