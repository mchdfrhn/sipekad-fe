import { useState, useEffect, useCallback } from "react";
import { getRequestDetail, updateRequestStatus } from "../../../utils/api/request";
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
  Play,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import IframeRequest from "./IframeRequest";
import ConfirmDialog from "../../ui/ConfirmDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { LoadingOverlay } from "@/components/ui/Loading";
import { useToast } from "@/utils/hooks/useToast";
import { STATUS_LABEL_ADMIN } from "../../../utils/constant";

import BASE_URL from "../../../utils/api";

const RequestDetail = () => {
  const { showToast } = useToast();
  const { id } = useParams();
  const [requestDetail, setRequestDetail] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [errMessage, setErrorMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [displayIframe, setDisplayIframe] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const fileUrl = requestDetail?.url
    ? requestDetail.url.startsWith("http")
      ? requestDetail.url
      : `${BASE_URL}${requestDetail.url.startsWith("/") ? "" : "/"}${requestDetail.url}`
    : null;

  const getDetail = useCallback(async () => {
    setLoading(true);
    await getRequestDetail(id, setRequestDetail, setResponses);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  const handleStatusChange = async (newStatus, messageText = null) => {
    setIsLoadingAction(true);

    if (messageText) {
      await addResponseHandler(
        { id, message: messageText, isComplete: null, file },
        () => {},
        false,
        setIsLoadingAction,
        setErrorMessage,
      );
    }

    const result = await updateRequestStatus(id, newStatus);
    if (result.status === "success") {
      showToast("Status berhasil diubah", "success");
      getDetail();
    } else {
      showToast(result.message || "Gagal mengubah status", "error");
    }
    setIsLoadingAction(false);
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

  if (loading && !requestDetail) {
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

  if (!requestDetail) return null;

  const activityTimeline = [
    {
      id: "created",
      type: "created",
      time: requestDetail?.created_at,
      title: "Pengajuan Dibuat",
      actor: requestDetail?.full_name,
    },
    ...responses.map((res, idx) => ({
      id: res.id || `response-${idx}`,
      type: "response",
      time: res.created_at || res.updated_at,
      actor: res.admin_name || "Admin",
      message: res.message,
      url: res.url
        ? res.url.startsWith("http")
          ? res.url
          : `${BASE_URL}${res.url.startsWith("/") ? "" : "/"}${res.url}`
        : null,
      index: idx,
    })),
    ...(requestDetail?.revisions || []).map((revision, idx) => ({
      id: revision.id || `revision-${idx}`,
      type: "revision",
      time: revision.created_at,
      actor: revision.user_name || requestDetail?.full_name,
      message: revision.message,
      url: revision.url
        ? revision.url.startsWith("http")
          ? revision.url
          : `${BASE_URL}${revision.url.startsWith("/") ? "" : "/"}${revision.url}`
        : null,
    })),
  ].sort((a, b) => new Date(a.time || 0) - new Date(b.time || 0));

  return (
    <div className="space-y-8 pb-10">
      {loading && <LoadingOverlay />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/pengajuan">
            <Button
              variant="ghost"
              className="gap-2 pl-0 hover:bg-transparent hover:text-[#4318FF] text-gray-500 transition-all"
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="text-lg font-bold">Kembali ke Daftar</span>
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
        <div className="xl:col-span-2 space-y-6">
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
                <p className="text-base font-bold text-[#2B3674]">
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
                      <Eye size={16} /> Pratinjau
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
                      <Download size={16} /> Unduh
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ActionPanel
            status={requestDetail?.status}
            message={message}
            setMessage={setMessage}
            file={file}
            setFile={setFile}
            errMessage={errMessage}
            isLoadingAction={isLoadingAction}
            onStatusChange={handleStatusChange}
            onConfirmAction={(action) => {
              setPendingAction(() => action);
              setShowConfirm(true);
            }}
          />

          <Card className="rounded-[20px] shadow-sm border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#2B3674]">
                Riwayat Aktivitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 py-2">
                {activityTimeline.map((activity) => {
                  if (activity.type === "created") {
                    return (
                      <div key={activity.id} className="relative">
                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                            {new Date(activity.time).toLocaleDateString(
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
                            oleh {activity.actor}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (activity.type === "revision") {
                    return (
                      <div key={activity.id} className="relative">
                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-orange-400 ring-4 ring-white"></div>
                        <div className="bg-orange-50 p-3 rounded-xl rounded-tl-none border border-orange-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-orange-600">
                              Revisi: {activity.actor}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(activity.time).toLocaleDateString(
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
                            {activity.message}
                          </p>
                          {activity.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewUrl(activity.url);
                                setDisplayIframe(true);
                              }}
                              className="h-7 text-xs w-full gap-2 mt-2 bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                              <Eye size={12} /> Pratinjau Berkas Revisi
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={activity.id} className="relative">
                      <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-[#4318FF] ring-4 ring-white"></div>
                      <div className="bg-gray-50 p-3 rounded-xl rounded-tl-none border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-[#4318FF]">
                            Respon: {activity.actor}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(activity.time).toLocaleDateString(
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
                          {activity.message}
                        </p>
                        {activity.url && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewUrl(activity.url);
                                setDisplayIframe(true);
                              }}
                              className="h-7 text-xs flex-1 gap-2 mt-2 bg-white"
                            >
                              <Eye size={12} /> Pratinjau
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                downloadFile(
                                  activity.url,
                                  `Respon-Admin-${activity.index + 1}.pdf`,
                                )
                              }
                              className="h-7 text-xs flex-1 gap-2 mt-2 bg-white text-[#4318FF] border border-[#4318FF] hover:bg-blue-50"
                            >
                              <Download size={12} /> Unduh
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {activityTimeline.length <= 1 && (
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

      {displayIframe && (
        <div
          onClick={() => setDisplayIframe(false)}
          className="fixed inset-0 w-screen h-screen z-50 bg-[#2B3674]/80 backdrop-blur-sm flex justify-center items-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
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

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPendingAction(null);
        }}
        onConfirm={() => {
          if (pendingAction) pendingAction();
          setShowConfirm(false);
          setPendingAction(null);
        }}
        title="Konfirmasi Aksi"
        description="Apakah Anda yakin ingin melanjutkan aksi ini?"
        confirmText="Ya, Lanjutkan"
        variant="primary"
      />
    </div>
  );
};

const ActionPanel = ({
  status,
  message,
  setMessage,
  file,
  setFile,
  errMessage,
  isLoadingAction,
  onStatusChange,
  onConfirmAction,
}) => {
  const [rejectMessage, setRejectMessage] = useState("");
  const [revisionMessage, setRevisionMessage] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);

  if (status === "submitted" || status === "pending") {
    return (
      <Card className="rounded-[20px] shadow-lg border-0 ring-1 ring-black/5 overflow-hidden">
        <div className="h-2 bg-blue-400"></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-[#2B3674]">
            Pengajuan Masuk
          </CardTitle>
          <CardDescription>Pengajuan baru sedang dalam antrian</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-700 mb-1">Sedang Diproses</p>
              <p className="text-xs text-blue-600">
                Pengajuan ini akan secara otomatis masuk ke tahap verifikasi saat dibuka oleh admin.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <BadgeStatus status={status} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "reviewing") {
    return (
      <Card className="rounded-[20px] shadow-lg border-0 ring-1 ring-black/5 overflow-hidden">
        <div className="h-2 bg-purple-500"></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-[#2B3674]">
            Sedang Diverifikasi
          </CardTitle>
          <CardDescription>Pilih tindakan untuk pengajuan ini</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full justify-start gap-2 bg-green-500 hover:bg-green-600 text-white font-bold"
            disabled={isLoadingAction}
            onClick={() =>
              onConfirmAction(() => onStatusChange("processing"))
            }
          >
            {isLoadingAction ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Mulai Proses
          </Button>

          {!showRevisionForm && !showRejectForm && (
            <>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-bold"
                disabled={isLoadingAction}
                onClick={() => setShowRevisionForm(true)}
              >
                <AlertCircle className="h-4 w-4" />
                Butuh Revisi
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 font-bold"
                disabled={isLoadingAction}
                onClick={() => setShowRejectForm(true)}
              >
                <XCircle className="h-4 w-4" />
                Tolak
              </Button>
            </>
          )}

          {showRevisionForm && (
            <div className="space-y-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <Label className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Pesan untuk User
              </Label>
              <Textarea
                value={revisionMessage}
                onChange={(e) => setRevisionMessage(e.target.value)}
                placeholder="Jelaskan revisi yang diperlukan..."
                className="min-h-[80px] resize-none text-sm bg-white border-orange-200"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                  disabled={isLoadingAction || !revisionMessage.trim()}
                  onClick={() => {
                    onStatusChange("revision_required", revisionMessage);
                    setShowRevisionForm(false);
                    setRevisionMessage("");
                  }}
                >
                  {isLoadingAction ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Kirim
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowRevisionForm(false)}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}

          {showRejectForm && (
            <div className="space-y-2 p-3 bg-red-50 rounded-xl border border-red-100">
              <Label className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Alasan Penolakan
              </Label>
              <Textarea
                value={rejectMessage}
                onChange={(e) => setRejectMessage(e.target.value)}
                placeholder="Jelaskan alasan penolakan..."
                className="min-h-[80px] resize-none text-sm bg-white border-red-200"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                  disabled={isLoadingAction || !rejectMessage.trim()}
                  onClick={() => {
                    onStatusChange("rejected", rejectMessage);
                    setShowRejectForm(false);
                    setRejectMessage("");
                  }}
                >
                  {isLoadingAction ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : null}
                  Tolak
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowRejectForm(false)}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (status === "processing") {
    return (
      <Card className="rounded-[20px] shadow-lg border-0 ring-1 ring-black/5 overflow-hidden">
        <div className="h-2 bg-teal-500"></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-[#2B3674]">
            Sedang Dikerjakan
          </CardTitle>
          <CardDescription>Selesaikan atau kembalikan pengajuan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proc-message" className="font-bold text-[#2B3674]">
                Pesan Balasan
              </Label>
              <Textarea
                id="proc-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan untuk mahasiswa..."
                className="min-h-[100px] resize-none bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proc-file" className="font-bold text-[#2B3674]">
                Lampiran (Opsional)
              </Label>
              <div className="relative">
                <input
                  type="file"
                  id="proc-file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="proc-file"
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
              className="w-full justify-start gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-5"
              disabled={isLoadingAction || !message.trim()}
              onClick={() => onStatusChange("completed", message)}
            >
              {isLoadingAction ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Selesaikan
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 font-bold"
              disabled={isLoadingAction || !message.trim()}
              onClick={() => onStatusChange("revision_required", message)}
            >
              <AlertCircle className="h-4 w-4" />
              Butuh Revisi
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 font-bold"
              disabled={isLoadingAction}
              onClick={() => onStatusChange("rejected", message || null)}
            >
              <XCircle className="h-4 w-4" />
              Tolak
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "revision_required") {
    return (
      <Card className="rounded-[20px] shadow-lg border-0 ring-1 ring-black/5 overflow-hidden">
        <div className="h-2 bg-orange-400"></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-[#2B3674]">
            Perlu Revisi
          </CardTitle>
          <CardDescription>
            Pengajuan dikembalikan ke user untuk direvisi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
            <p className="text-xs text-orange-700">
              User sedang melakukan revisi. Anda dapat melanjutkan proses atau menolak pengajuan ini.
            </p>
          </div>
          <Button
            className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold"
            disabled={isLoadingAction}
            onClick={() => onStatusChange("processing")}
          >
            {isLoadingAction ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Lanjut Proses
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 font-bold"
            disabled={isLoadingAction}
            onClick={() => onStatusChange("rejected")}
          >
            <XCircle className="h-4 w-4" />
            Tolak
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "rejected" || status === "canceled") {
    return (
      <Card className="rounded-[20px] shadow-sm border-0 bg-red-50">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <XCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#2B3674] mb-1">
            Pengajuan Ditolak
          </h3>
          <p className="text-sm text-gray-500 px-4">
            Pengajuan ini telah ditolak.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (status === "completed") {
    return (
      <Card className="rounded-[20px] shadow-sm border-0 bg-green-50">
        <CardContent className="pt-6 pb-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#2B3674] mb-1">
            Pengajuan Selesai
          </h3>
          <p className="text-sm text-gray-500 px-4">
            Pengajuan ini telah diselesaikan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
};

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
    submitted: "bg-blue-50 text-blue-600 border border-blue-100",
    pending: "bg-blue-50 text-blue-600 border border-blue-100",
    reviewing: "bg-purple-50 text-purple-600 border border-purple-100",
    processing: "bg-teal-50 text-teal-600 border border-teal-100",
    revision_required: "bg-orange-50 text-orange-600 border border-orange-100",
    rejected: "bg-red-50 text-red-600 border border-red-100",
    canceled: "bg-red-50 text-red-600 border border-red-100",
    completed: "bg-green-50 text-green-600 border border-green-100",
  };

  const icons = {
    submitted: <Send size={12} className="mr-1" />,
    pending: <Send size={12} className="mr-1" />,
    reviewing: <Eye size={12} className="mr-1" />,
    processing: <Play size={12} className="mr-1" />,
    revision_required: <AlertCircle size={12} className="mr-1" />,
    rejected: <XCircle size={12} className="mr-1" />,
    canceled: <XCircle size={12} className="mr-1" />,
    completed: <CheckCircle2 size={12} className="mr-1" />,
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center ${
        styles[status] || "bg-gray-50 text-gray-600"
      }`}
    >
      {icons[status]}
      {STATUS_LABEL_ADMIN[status] || status}
    </span>
  );
};

export default RequestDetail;
