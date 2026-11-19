import { useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Clock, Upload, Eye, Loader2, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/utils/hooks/useToast";
import { uploadItem, reviewItem } from "@/utils/api/event";
import { getSignedUrl } from "@/utils/api/storage";
import { CATEGORY_LABELS, ITEM_STATUS, formatDateTime, groupByCategory } from "@/utils/eventConstants";

const FINAL = ["completed", "rejected", "canceled"];
const MAX_SIZE = 10 * 1024 * 1024;

const StatusIcon = ({ status }) => {
  if (status === "approved") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === "revision") return <AlertCircle className="h-5 w-5 text-orange-500" />;
  if (status === "submitted") return <Clock className="h-5 w-5 text-blue-500" />;
  return <div className="h-5 w-5 rounded-full border-2 border-gray-200" />;
};

const openFile = async (url) => {
  const win = window.open("", "_blank");
  const signed = await getSignedUrl(url);
  if (win) win.location.href = signed;
};

const UserActions = ({ item, locked, onChanged }) => {
  const { showToast } = useToast();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  if (!item.needs_upload) {
    return (
      <p className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400">
        <ShieldCheck className="h-3 w-3" /> Diverifikasi langsung oleh admin
      </p>
    );
  }
  const canUpload = !locked && ["pending", "revision", "submitted"].includes(item.status);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_SIZE) {
      showToast("Ukuran file maksimal 10 MB", "error");
      return;
    }
    setBusy(true);
    const res = await uploadItem(item.id, file);
    setBusy(false);
    if (res.status === "success") {
      showToast(`Berkas "${item.title}" terunggah`, "success");
      onChanged();
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {item.file_url && (
        <Button type="button" size="sm" variant="outline" onClick={() => openFile(item.file_url)} className="rounded-xl font-bold text-xs">
          <Eye className="h-3.5 w-3.5 mr-1" /> Lihat
        </Button>
      )}
      {canUpload && (
        <>
          <input ref={inputRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={onFile} />
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className={`rounded-xl font-bold text-xs text-white ${item.status === "revision" ? "bg-orange-500 hover:bg-orange-600" : "bg-[#4318FF] hover:bg-[#3311CC]"}`}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
            {item.file_url ? "Ganti berkas" : "Unggah"}
          </Button>
        </>
      )}
    </div>
  );
};

const AdminActions = ({ item, locked, onChanged }) => {
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(item.admin_note || "");

  const send = async (status, adminNote) => {
    setBusy(true);
    const res = await reviewItem(item.id, status, adminNote);
    setBusy(false);
    if (res.status === "success") {
      setNoteOpen(false);
      onChanged();
    } else {
      showToast(res.message, "error");
    }
  };

  const awaitingFile = item.needs_upload && !item.file_url;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {item.file_url && (
          <Button type="button" size="sm" variant="outline" onClick={() => openFile(item.file_url)} className="rounded-xl font-bold text-xs">
            <Eye className="h-3.5 w-3.5 mr-1" /> Lihat berkas
          </Button>
        )}
        {!locked && (
          <>
            <Button
              type="button"
              size="sm"
              disabled={busy || awaitingFile || item.status === "approved"}
              onClick={() => send("approved")}
              className="rounded-xl font-bold text-xs bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Sesuai
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={busy}
              onClick={() => setNoteOpen((v) => !v)}
              className="rounded-xl font-bold text-xs bg-orange-500 hover:bg-orange-600 text-white"
            >
              <AlertCircle className="h-3.5 w-3.5 mr-1" /> Revisi
            </Button>
          </>
        )}
      </div>
      {awaitingFile && !locked && <p className="text-[11px] text-gray-400">Menunggu mahasiswa mengunggah berkas.</p>}
      {noteOpen && (
        <div className="flex gap-2 items-start">
          <textarea
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tulis apa yang perlu diperbaiki..."
            className="flex-1 min-h-[70px] px-3 py-2 text-sm bg-gray-50 rounded-xl border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              size="sm"
              disabled={busy || !note.trim()}
              onClick={() => send("revision", note.trim())}
              className="rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white"
            >
              Simpan
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setNoteOpen(false)} className="rounded-xl">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const RequirementChecklist = ({ items, mode, requestStatus, onChanged }) => {
  const locked = FINAL.includes(requestStatus);
  const required = items.filter((i) => i.is_required);
  const approved = required.filter((i) => i.status === "approved").length;
  const percent = required.length ? Math.round((approved / required.length) * 100) : 0;
  const Actions = mode === "admin" ? AdminActions : UserActions;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-bold text-[#2B3674]">
          <span>{approved} dari {required.length} syarat wajib terverifikasi</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-[#4318FF] transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {groupByCategory(items).map(({ category, items: group }) => (
        <div key={category} className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{CATEGORY_LABELS[category]}</p>
          <ul className="space-y-3">
            {group.map((item) => {
              const st = ITEM_STATUS[item.status] || ITEM_STATUS.pending;
              const label = !item.needs_upload && item.status === "pending" ? "Menunggu verifikasi admin" : st.label;
              return (
                <li
                  key={item.id}
                  className={`rounded-2xl border p-4 space-y-3 ${item.status === "revision" ? "border-orange-200 bg-orange-50/40" : "border-gray-100"}`}
                >
                  <div className="flex gap-3 items-start">
                    <StatusIcon status={item.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-[#2B3674]">{item.title}</p>
                        {!item.is_required && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Opsional</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{label}</span>
                      </div>
                      {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                      {item.file_name && (
                        <p className="text-[11px] text-gray-400 mt-1 truncate">
                          {item.file_name} · {formatDateTime(item.uploaded_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.status === "revision" && item.admin_note && (
                    <div className="text-xs font-semibold text-orange-700 bg-orange-100/60 rounded-xl px-3 py-2">
                      Catatan admin: {item.admin_note}
                    </div>
                  )}
                  <Actions item={item} locked={locked} onChanged={onChanged} />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RequirementChecklist;
