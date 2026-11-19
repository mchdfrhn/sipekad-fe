import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Loader2, Send, CalendarCheck2, XCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/utils/hooks/useToast";
import { submitReview, saveSchedule } from "@/utils/api/event";
import { formatDate, toJakartaInput, fromJakartaInput } from "@/utils/eventConstants";
import ScheduleCard from "./ScheduleCard";
import DatePicker from "@/components/ui/DatePicker";

const inputCls =
  "w-full px-4 py-3 bg-[#F4F7FE] text-[#2B3674] rounded-2xl text-sm font-semibold placeholder:text-gray-400 placeholder:font-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#4318FF]";
const labelCls = "text-xs font-bold text-[#2B3674]";

const ScheduleForm = ({ requestId, schedule, onSaved }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ scheduled_at: "", room: "", supervisor_names: "", examiner_names: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      scheduled_at: toJakartaInput(schedule?.scheduled_at),
      room: schedule?.room || "",
      supervisor_names: schedule?.supervisor_names || "",
      examiner_names: schedule?.examiner_names || "",
      notes: schedule?.notes || "",
    });
  }, [schedule]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await saveSchedule(requestId, {
      ...form,
      scheduled_at: fromJakartaInput(form.scheduled_at),
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (res.status === "success") {
      showToast(schedule ? "Jadwal diperbarui dan mahasiswa diberi tahu" : "Jadwal ditetapkan dan mahasiswa diberi tahu", "success");
      onSaved();
    } else showToast(res.message, "error");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1">
        <label className={labelCls}>Tanggal & jam</label>
        <DatePicker required withTime value={form.scheduled_at} onChange={(value) => setForm((f) => ({ ...f, scheduled_at: value }))} />
      </div>
      <div className="space-y-1">
        <label className={labelCls}>Ruang</label>
        <input required value={form.room} onChange={set("room")} className={inputCls} />
      </div>
      <div className="space-y-1">
        <label className={labelCls}>Pembimbing</label>
        <textarea required rows={2} value={form.supervisor_names} onChange={set("supervisor_names")} className={`${inputCls} resize-none`} />
      </div>
      <div className="space-y-1">
        <label className={labelCls}>Penguji</label>
        <textarea required rows={2} value={form.examiner_names} onChange={set("examiner_names")} className={`${inputCls} resize-none`} />
      </div>
      <div className="space-y-1">
        <label className={labelCls}>Catatan (opsional)</label>
        <textarea rows={2} value={form.notes} onChange={set("notes")} className={`${inputCls} resize-none`} />
      </div>
      <Button disabled={saving} type="submit" className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-5">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck2 className="h-4 w-4" />}
        {schedule ? "Perbarui Jadwal" : "Tetapkan Jadwal"}
      </Button>
    </form>
  );
};

const EventAdminPanel = ({ request, onChanged, onReject }) => {
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const items = request.requirement_items || [];
  const required = items.filter((i) => i.is_required);
  const allApproved = required.length > 0 && required.every((i) => i.status === "approved");
  const hasRevision = items.some((i) => i.status === "revision");
  const unreviewed = items.filter((i) => i.status === "submitted" || (i.status === "pending" && !i.needs_upload)).length;
  const status = request.status;
  const isFinal = ["completed", "rejected", "canceled"].includes(status);

  const send = async () => {
    setSending(true);
    const res = await submitReview(request.id);
    setSending(false);
    if (res.status === "success") {
      showToast(
        res.data.status === "revision_required"
          ? "Catatan revisi dikirim ke mahasiswa"
          : "Mahasiswa diberi tahu bahwa berkas lengkap",
        "success",
      );
      onChanged();
    } else showToast(res.message, "error");
  };

  return (
    <Card className="rounded-[20px] border-gray-100/80 shadow-[0_4px_24px_rgba(67,24,255,0.06)] overflow-hidden">
      <div className={`h-2 ${status === "completed" ? "bg-green-500" : status === "rejected" ? "bg-red-500" : "bg-[#4318FF]"}`} />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-[#2B3674]">Verifikasi & Jadwal</CardTitle>
        {request.event_period && (
          <CardDescription>
            <Link to={`/admin/acara/${request.event_period.id}`} className="hover:text-[#4318FF] font-semibold">
              {request.event_period.name}
            </Link>{" "}
            · tutup {formatDate(request.event_period.registration_end)}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        {status === "rejected" || status === "canceled" ? (
          <p className="text-sm font-bold text-red-500">Pendaftaran ini sudah ditolak/dibatalkan.</p>
        ) : (
          <>
            {!isFinal && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  Nilai setiap syarat di panel kiri, lalu kirim hasilnya. Mahasiswa menerima satu pemberitahuan berisi semua catatan revisi.
                </p>
                {unreviewed > 0 && <p className="text-xs font-bold text-blue-600">{unreviewed} syarat belum dinilai.</p>}
                <Button
                  disabled={sending || (!hasRevision && !allApproved) || (status === "processing" && !hasRevision)}
                  onClick={send}
                  className="w-full gap-2 bg-[#4318FF] hover:bg-[#3311CC] text-white font-bold rounded-xl py-5"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Kirim Hasil Verifikasi
                </Button>
                {status === "revision_required" && (
                  <p className="text-xs text-orange-600 font-semibold">Menunggu mahasiswa mengunggah ulang berkas revisi.</p>
                )}
              </div>
            )}

            {status === "completed" && (
              <p className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Lock className="h-3.5 w-3.5" /> Persyaratan terkunci karena jadwal sudah ditetapkan.
              </p>
            )}

            <ScheduleCard schedule={request.schedule} />

            {status === "processing" || status === "completed" ? (
              <ScheduleForm requestId={request.id} schedule={request.schedule} onSaved={onChanged} />
            ) : (
              <p className="text-xs text-gray-400">
                Form jadwal aktif setelah semua syarat wajib terverifikasi dan hasil verifikasi dikirim.
              </p>
            )}

            {!isFinal && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setRejectOpen((v) => !v)}
                  className="w-full gap-2 text-red-500 border-red-100 hover:bg-red-50 font-bold rounded-xl"
                >
                  <XCircle className="h-4 w-4" /> Tolak Pendaftaran
                </Button>
                {rejectOpen && (
                  <>
                    <textarea
                      rows={3}
                      value={rejectMessage}
                      onChange={(e) => setRejectMessage(e.target.value)}
                      placeholder="Alasan penolakan (dikirim ke mahasiswa)..."
                      className={`${inputCls} resize-none`}
                    />
                    <Button
                      disabled={!rejectMessage.trim()}
                      onClick={() => onReject(rejectMessage.trim())}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl"
                    >
                      Konfirmasi Tolak
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EventAdminPanel;
