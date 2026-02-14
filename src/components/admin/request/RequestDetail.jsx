import { useState, useEffect } from "react";
import { getRequestDetail } from "../../../utils/api/request";
import { useParams, Link } from "react-router";
import { addResponseHandler } from "../../../utils/action";
import {
  Loader2,
  ArrowLeft,
  Link as LinkIcon,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Hash,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
  Paperclip,
} from "lucide-react";
import IframeRequest from "./IframeRequest";
import SuccessModal from "../../ui/SuccessModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import BASE_URL from "../../../utils/api";
// ... imports

const RequestDetail = () => {
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);
  const [requestDetail, setRequestDetail] = useState(null);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [displayIframe, setDisplayIframe] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [isDisplay, setIsDisplay] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [errMessage, setErrorMessage] = useState("");

  const fileUrl = requestDetail?.url
    ? requestDetail.url.startsWith("http")
      ? requestDetail.url
      : `${BASE_URL}${requestDetail.url.startsWith("/") ? "" : "/"}${requestDetail.url}`
    : null;

  useEffect(() => {
    getRequestDetail(id, setRequestDetail, setResponses);
  }, [id]);

  const onOkHandler = async () => {
    setIsDisplay(!isDisplay);
    await getRequestDetail(id, setRequestDetail, setResponses);
    setMessage("");
    setFile(null);
  };

  const toTitleCase = (str) => {
    if (!str) return "-";
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  const onAddResponseHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    addResponseHandler(
      { id, message, isComplete: isActive, file },
      setIsDisplay,
      isDisplay,
      setLoading,
      setErrorMessage,
    );
  };

  if (!requestDetail) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#4318FF]" />
          <p className="text-sm font-medium text-gray-500">
            Memuat detail pengajuan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {isDisplay && (
        <SuccessModal
          onOkHandler={onOkHandler}
          text={"Respon berhasil dikirim!"}
        />
      )}

      {/* Modern Header */}
      {/* Modern Header - Simplified */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/pengajuan">
            <Button
              variant="ghost"
              className="gap-2 pl-0 hover:bg-transparent hover:text-[#4318FF] text-gray-500 transition-all"
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="text-lg font-bold">Kembali</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <BadgeStatus status={requestDetail?.status} />
          <div className="h-8 w-px bg-gray-300 mx-2 hidden md:block"></div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Tanggal Pengajuan
            </p>
            <p className="text-sm font-bold text-[#2B3674]">
              {new Date(requestDetail?.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 text-[#4318FF] flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Details (2 spans) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Main Info Card */}
          <Card className="rounded-[20px] shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
                <User className="h-5 w-5 text-[#4318FF]" />
                Informasi Pemohon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Nama Lengkap"
                  value={
                    <Link
                      to={`/admin/user/${requestDetail?.user_id}`}
                      className="hover:text-[#4318FF] flex items-center gap-1 transition-colors"
                    >
                      {requestDetail?.full_name} <LinkIcon size={12} />
                    </Link>
                  }
                />
                <DetailRow
                  icon={<Hash className="h-4 w-4" />}
                  label="NIM"
                  value={requestDetail?.nim}
                />
                <DetailRow
                  icon={<GraduationCap className="h-4 w-4" />}
                  label="Program Studi"
                  value={toTitleCase(requestDetail?.prodi)}
                />
                <DetailRow
                  icon={<Hash className="h-4 w-4" />}
                  label="NIK"
                  value={requestDetail?.nik || "-"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Request Content Card */}
          <Card className="rounded-[20px] shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#4318FF]" />
                Isi Pengajuan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-400 uppercase text-xs font-bold tracking-wider">
                  Jenis Surat
                </Label>
                <p className="text-lg font-bold text-[#2B3674]">
                  {requestDetail?.type}
                </p>
              </div>

              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                <h4 className="flex items-center gap-2 font-bold text-[#2B3674] mb-3 text-sm uppercase tracking-wide">
                  <MessageSquare className="h-4 w-4 text-[#4318FF]" />
                  Pesan / Keterangan
                </h4>
                <p className="text-[#2B3674] leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  "{requestDetail?.message}"
                </p>
              </div>

              {requestDetail?.url && (
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2B3674] text-sm line-clamp-1">
                        Lampiran Pengajuan
                      </p>
                      <p className="text-xs text-gray-500">Dokumen PDF</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewUrl(fileUrl);
                        setDisplayIframe(true);
                      }}
                      className="flex-1 sm:flex-none gap-2 text-gray-600"
                    >
                      <Eye size={16} /> Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadFile(
                          fileUrl,
                          `${requestDetail?.full_name}-${requestDetail?.queue}.pdf`,
                        )
                      }
                      className="flex-1 sm:flex-none gap-2 bg-[#4318FF] hover:bg-[#3311CC]"
                    >
                      <Download size={16} /> Download
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions & Timeline (1 span) */}
        <div className="space-y-6">
          {/* Action Card */}
          {requestDetail?.status === "pending" ? (
            <Card className="rounded-[20px] shadow-lg border-0 ring-1 ring-black/5 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-[#2B3674]">
                  Tindak Lanjut
                </CardTitle>
                <CardDescription>Proses pengajuan ini sekarang</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onAddResponseHandler} className="space-y-5">
                  <div className="space-y-3">
                    <Label className="font-bold text-[#2B3674]">
                      Keputusan
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${isActive ? "bg-green-50 border-green-200 ring-1 ring-green-500" : "bg-white border-gray-200 hover:border-gray-300"}`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name="status"
                          checked={isActive}
                          onChange={() => setIsActive(true)}
                        />
                        <CheckCircle2
                          className={`h-6 w-6 ${isActive ? "text-green-600" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm font-bold ${isActive ? "text-green-700" : "text-gray-500"}`}
                        >
                          Setujui
                        </span>
                      </label>
                      <label
                        className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${!isActive ? "bg-red-50 border-red-200 ring-1 ring-red-500" : "bg-white border-gray-200 hover:border-gray-300"}`}
                      >
                        <input
                          type="radio"
                          className="hidden"
                          name="status"
                          checked={!isActive}
                          onChange={() => setIsActive(false)}
                        />
                        <XCircle
                          className={`h-6 w-6 ${!isActive ? "text-red-600" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm font-bold ${!isActive ? "text-red-700" : "text-gray-500"}`}
                        >
                          Tolak
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="font-bold text-[#2B3674]"
                    >
                      Pesan Balasan
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tulis pesan untuk mahasiswa..."
                      className="min-h-[100px] resize-none bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file" className="font-bold text-[#2B3674]">
                      Lampiran (Opsional)
                    </Label>
                    <div className="relative">
                      <input
                        type="file"
                        id="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                      />
                      <label
                        htmlFor="file"
                        className="flex items-center gap-2 w-full p-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:bg-gray-50 hover:border-[#4318FF] transition-all"
                      >
                        <Paperclip className="h-4 w-4" />
                        {file ? file.name : "Klik untuk upload file"}
                      </label>
                    </div>
                  </div>

                  {errMessage && (
                    <div className="text-xs bg-red-50 text-red-600 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                      <XCircle className="h-4 w-4" /> {errMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-[#4318FF] hover:bg-[#3311CC] py-6 font-bold text-base shadow-lg shadow-blue-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}
                    {isActive ? "Kirim & Setujui" : "Kirim & Tolak"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-[20px] shadow-sm border-0 bg-gradient-to-b from-white to-gray-50">
              <CardContent className="pt-6 pb-8 text-center">
                <div
                  className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${requestDetail?.status === "completed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {requestDetail?.status === "completed" ? (
                    <CheckCircle2 size={32} />
                  ) : (
                    <XCircle size={32} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#2B3674] mb-1">
                  Pengajuan Selesai
                </h3>
                <p className="text-sm text-gray-500 px-4">
                  Pengajuan ini telah{" "}
                  <span className="font-bold">
                    {requestDetail?.status === "completed"
                      ? "disetujui"
                      : "ditolak"}
                  </span>
                  . Anda tidak dapat mengubah statusnya lagi.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Timeline Card */}
          <Card className="rounded-[20px] shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#2B3674]">
                Riwayat Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 py-2">
                {/* Current Request Node */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                      {new Date(requestDetail?.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                    <p className="text-sm font-bold text-[#2B3674]">
                      Pengajuan Dibuat
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      oleh {requestDetail?.full_name}
                    </p>
                  </div>
                </div>

                {/* Responses */}
                {responses.map((res, idx) => {
                  const resUrl = res.url
                    ? res.url.startsWith("http")
                      ? res.url
                      : `${BASE_URL}${res.url.startsWith("/") ? "" : "/"}${res.url}`
                    : null;

                  return (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-[#4318FF] ring-4 ring-white"></div>
                      <div className="bg-gray-50 p-3 rounded-xl rounded-tl-none border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-[#4318FF]">
                            Admin Respon
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(res.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {res.message}
                        </p>
                        {res.url && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewUrl(resUrl);
                                setDisplayIframe(true);
                              }}
                              className="h-7 text-xs flex-1 gap-2 mt-2 bg-white"
                            >
                              <Eye size={12} /> Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                downloadFile(
                                  resUrl,
                                  `Respon-Admin-${idx + 1}.pdf`,
                                )
                              }
                              className="h-7 text-xs flex-1 gap-2 mt-2 bg-white text-[#4318FF] border border-[#4318FF] hover:bg-blue-50"
                            >
                              <Download size={12} /> Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {responses.length === 0 &&
                  requestDetail?.status !== "pending" && (
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-300 ring-4 ring-white"></div>
                      <p className="text-sm text-gray-400 italic">
                        Belum ada balasan pesan.
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Iframe Modal */}
      {displayIframe && (
        <div
          onClick={() => setDisplayIframe(false)}
          className="fixed inset-0 w-screen h-screen z-50 bg-[#2B3674]/80 backdrop-blur-sm flex justify-center items-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          >
            <div className="p-4 border-b flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#2B3674]">
                    Preview Dokumen
                  </h3>
                  <p className="text-xs text-gray-500">Mode Pratinjau</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full hover:bg-gray-100"
                onClick={() => setDisplayIframe(false)}
              >
                Tutup
              </Button>
            </div>
            <div className="flex-1 bg-gray-100 p-0 relative h-full">
              <IframeRequest
                url={previewUrl}
                className="w-full h-full min-h-[500px] border-0 rounded-none shadow-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-gray-400">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="text-sm font-bold text-[#2B3674]">{value || "-"}</div>
    </div>
  </div>
);

const BadgeStatus = ({ status }) => {
  const styles = {
    pending: "bg-orange-50 text-orange-600 border border-orange-100",
    completed: "bg-green-50 text-green-600 border border-green-100",
    canceled: "bg-red-50 text-red-600 border border-red-100",
  };

  const icons = {
    pending: <Clock size={12} className="mr-1" />,
    completed: <CheckCircle2 size={12} className="mr-1" />,
    canceled: <XCircle size={12} className="mr-1" />,
  };

  const labels = {
    pending: "Menunggu Konfirmasi",
    completed: "Selesai",
    canceled: "Ditolak",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center ${
        styles[status] || "bg-gray-50 text-gray-600"
      }`}
    >
      {icons[status]}
      {labels[status] || status}
    </span>
  );
};

export default RequestDetail;
