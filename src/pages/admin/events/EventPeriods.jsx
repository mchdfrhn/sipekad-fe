import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Plus, Pencil, Trash2, Loader2, ListChecks, Users, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/utils/hooks/useToast";
import { getPeriods, createPeriod, updatePeriod, deletePeriod } from "@/utils/api/event";
import {
  EVENT_TYPES,
  EVENT_TYPE_KEYS,
  PERIOD_STATE,
  formatDate,
  toJakartaInput,
  fromJakartaInput,
  PRODI_OPTIONS,
} from "@/utils/eventConstants";
import CustomSelect from "@/components/ui/CustomSelect";
import DatePicker from "@/components/ui/DatePicker";
import PageHeader from "@/components/ui/PageHeader";

const inputCls =
  "w-full px-4 py-3 bg-[#F4F7FE] text-[#2B3674] rounded-2xl text-sm font-semibold placeholder:text-gray-400 placeholder:font-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-[#4318FF]";
const labelCls = "text-xs font-bold text-[#2B3674]";

const emptyForm = (eventType) => ({
  event_type: eventType,
  name: "",
  registration_start: "",
  registration_end: "",
  event_start: "",
  event_end: "",
  quota: "",
  description: "",
  prodi: "",
  is_published: false,
});

const toForm = (p) => ({
  event_type: p.event_type,
  name: p.name,
  registration_start: toJakartaInput(p.registration_start).slice(0, 10),
  registration_end: toJakartaInput(p.registration_end).slice(0, 10),
  event_start: p.event_start ? String(p.event_start).slice(0, 10) : "",
  event_end: p.event_end ? String(p.event_end).slice(0, 10) : "",
  quota: p.quota ?? "",
  description: p.description || "",
  prodi: p.prodi || "",
  is_published: p.is_published,
});

const toBody = (f) => ({
  event_type: f.event_type,
  name: f.name.trim(),
  // Registration runs from 00:00 WIB on the first day to 23:59 WIB on the last day.
  registration_start: fromJakartaInput(`${f.registration_start}T00:00`),
  registration_end: new Date(`${f.registration_end}T23:59:59+07:00`).toISOString(),
  event_start: f.event_start || null,
  event_end: f.event_end || null,
  quota: f.quota === "" ? null : Number(f.quota),
  description: f.description.trim() || null,
  prodi: f.prodi || null,
  is_published: f.is_published,
});

const PeriodFormDialog = ({ open, onOpenChange, period, eventType, onSaved }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm(eventType));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(period ? toForm(period) : emptyForm(eventType));
  }, [open, period, eventType]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const setValue = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = period ? await updatePeriod(period.id, toBody(form)) : await createPeriod(toBody(form));
    setSaving(false);
    if (res.status === "success") {
      showToast(period ? "Gelombang diperbarui" : "Gelombang dibuat", "success");
      onOpenChange(false);
      onSaved();
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[20px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#2B3674]">{period ? "Ubah Gelombang" : "Buat Gelombang"}</DialogTitle>
          <DialogDescription>Pendaftaran dibuka mulai 00:00 WIB pada tanggal awal dan ditutup 23:59 WIB pada tanggal akhir.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>Jenis acara</label>
            <CustomSelect
              value={form.event_type}
              onChange={setValue("event_type")}
              options={EVENT_TYPE_KEYS.map((k) => ({ value: k, label: EVENT_TYPES[k].label }))}
            />
          </div>
          <div className="space-y-1">
            <label className={labelCls}>Program studi</label>
            <CustomSelect
              value={form.prodi}
              onChange={setValue("prodi")}
              options={[{ value: "", label: "Semua program studi" }, ...PRODI_OPTIONS.map((p) => ({ value: p, label: p }))]}
            />
          </div>
          <div className="space-y-1">
            <label className={labelCls}>Nama gelombang</label>
            <input required value={form.name} onChange={set("name")} placeholder="Gelombang Desember 2026" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>Pendaftaran dibuka</label>
              <DatePicker required value={form.registration_start} onChange={setValue("registration_start")} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Pendaftaran ditutup</label>
              <DatePicker required value={form.registration_end} onChange={setValue("registration_end")} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Perkiraan pelaksanaan mulai</label>
              <DatePicker clearable value={form.event_start} onChange={setValue("event_start")} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Perkiraan pelaksanaan selesai</label>
              <DatePicker clearable value={form.event_end} onChange={setValue("event_end")} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelCls}>Kuota (kosongkan bila tanpa batas)</label>
            <input type="number" min="1" value={form.quota} onChange={set("quota")} className={inputCls} />
          </div>
          <div className="space-y-1">
            <label className={labelCls}>Pengumuman untuk mahasiswa</label>
            <textarea value={form.description} onChange={set("description")} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-[#2B3674]">
            <input type="checkbox" checked={form.is_published} onChange={set("is_published")} className="h-4 w-4 accent-[#4318FF]" />
            Publikasikan (terlihat oleh mahasiswa)
          </label>
          <Button disabled={saving} type="submit" className="w-full h-11 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl font-bold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EventPeriods = () => {
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();
  const eventType = EVENT_TYPES[params.get("tab")] ? params.get("tab") : "seminar_kp";
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getPeriods(eventType);
    if (res.status === "success") setPeriods(res.data);
    else showToast(res.message, "error");
    setLoading(false);
  }, [eventType, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    const p = toDelete;
    setToDelete(null);
    const res = await deletePeriod(p.id);
    if (res.status === "success") {
      showToast("Gelombang dihapus", "success");
      load();
    } else showToast(res.message, "error");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarDays}
        title="Jadwal Seminar & Sidang"
        description="Buka gelombang pendaftaran dan pantau kelengkapan persyaratan."
        actions={
          <div className="flex gap-2">
          <Link
            to={`/admin/acara/persyaratan?tab=${eventType}`}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 text-sm font-bold text-[#2B3674] hover:bg-gray-50"
          >
            <ListChecks className="h-4 w-4" /> Kelola Persyaratan
          </Link>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="h-10 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl font-bold"
          >
            <Plus className="h-4 w-4 mr-1" /> Buat Gelombang
          </Button>
        </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {EVENT_TYPE_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setParams({ tab: k })}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${k === eventType ? "bg-[#4318FF] text-white" : "bg-white text-[#2B3674] hover:bg-indigo-50"}`}
          >
            {EVENT_TYPES[k].label}
          </button>
        ))}
      </div>

      <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-50">
          <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#4318FF]" /> Gelombang {EVENT_TYPES[eventType].label}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-[#4318FF]" />
          ) : periods.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Belum ada gelombang. Klik "Buat Gelombang".</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 pr-4">Gelombang</th>
                    <th className="py-3 pr-4">Program Studi</th>
                    <th className="py-3 pr-4">Pendaftaran</th>
                    <th className="py-3 pr-4">Pelaksanaan</th>
                    <th className="py-3 pr-4">Pendaftar</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3" />
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p) => {
                    const st = PERIOD_STATE[p.state];
                    return (
                      <tr key={p.id} className="border-t border-gray-50 align-top">
                        <td className="py-3 pr-4 font-bold text-[#2B3674] min-w-[180px]">
                          <Link to={`/admin/acara/${p.id}`} className="hover:text-[#4318FF]">{p.name}</Link>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{p.prodi || "Semua prodi"}</td>
                        <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                          {formatDate(p.registration_start)} – {formatDate(p.registration_end)}
                        </td>
                        <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                          {p.event_start ? `${formatDate(p.event_start)}${p.event_end ? ` – ${formatDate(p.event_end)}` : ""}` : "-"}
                        </td>
                        <td className="py-3 pr-4 text-gray-600">
                          {p.registered_count}
                          {p.quota ? ` / ${p.quota}` : ""}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="py-3 text-right whitespace-nowrap">
                          <Link to={`/admin/acara/${p.id}`} title="Pendaftar" className="inline-flex p-2 rounded-lg hover:bg-indigo-50 text-[#4318FF]">
                            <Users className="h-4 w-4" />
                          </Link>
                          <button
                            title="Ubah"
                            onClick={() => {
                              setEditing(p);
                              setFormOpen(true);
                            }}
                            className="inline-flex p-2 rounded-lg hover:bg-indigo-50 text-[#2B3674]"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            title="Hapus"
                            disabled={p.registered_count > 0}
                            onClick={() => setToDelete(p)}
                            className="inline-flex p-2 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <PeriodFormDialog open={formOpen} onOpenChange={setFormOpen} period={editing} eventType={eventType} onSaved={load} />
      <ConfirmDialog
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Hapus gelombang?"
        description={toDelete ? `"${toDelete.name}" akan dihapus permanen.` : ""}
        confirmText="Hapus"
      />
    </div>
  );
};

export default EventPeriods;
