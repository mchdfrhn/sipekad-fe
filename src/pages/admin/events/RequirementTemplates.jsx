import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Pencil, Loader2, EyeOff, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/utils/hooks/useToast";
import { getTemplates, createTemplate, updateTemplate, reorderTemplates } from "@/utils/api/event";
import { EVENT_TYPES, EVENT_TYPE_KEYS, CATEGORY_LABELS, CATEGORY_ORDER } from "@/utils/eventConstants";

const inputCls =
  "w-full px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4318FF]";

const blank = { category: "berkas", title: "", description: "", needs_upload: true, is_required: true };

const TemplateDialog = ({ open, onOpenChange, template, eventType, onSaved }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        template
          ? {
              category: template.category,
              title: template.title,
              description: template.description || "",
              needs_upload: template.needs_upload,
              is_required: template.is_required,
            }
          : blank,
      );
    }
  }, [open, template]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, title: form.title.trim(), description: form.description.trim() || null };
    const res = template ? await updateTemplate(template.id, body) : await createTemplate({ ...body, event_type: eventType });
    setSaving(false);
    if (res.status === "success") {
      onOpenChange(false);
      onSaved();
    } else showToast(res.message, "error");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="text-[#2B3674]">{template ? "Ubah Syarat" : "Tambah Syarat"}</DialogTitle>
          <DialogDescription>Perubahan hanya berlaku untuk pendaftar baru.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <select value={form.category} onChange={set("category")} className={inputCls}>
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
          <input required value={form.title} onChange={set("title")} placeholder="Nama syarat" className={inputCls} />
          <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Keterangan (opsional)" className={`${inputCls} resize-none`} />
          <label className="flex items-center gap-2 text-sm font-bold text-[#2B3674]">
            <input type="checkbox" checked={form.needs_upload} onChange={set("needs_upload")} className="h-4 w-4 accent-[#4318FF]" />
            Mahasiswa mengunggah berkas (jika tidak, cukup dicentang admin)
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-[#2B3674]">
            <input type="checkbox" checked={form.is_required} onChange={set("is_required")} className="h-4 w-4 accent-[#4318FF]" />
            Wajib
          </label>
          <Button disabled={saving} type="submit" className="w-full h-11 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl font-bold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RequirementTemplates = () => {
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();
  const eventType = EVENT_TYPES[params.get("tab")] ? params.get("tab") : "seminar_kp";
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getTemplates(eventType, true);
    if (res.status === "success") setTemplates(res.data);
    else showToast(res.message, "error");
    setLoading(false);
  }, [eventType, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const move = async (index, dir) => {
    const next = [...templates];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setTemplates(next);
    const res = await reorderTemplates(next.map((t) => t.id));
    if (res.status !== "success") {
      showToast(res.message, "error");
      load();
    }
  };

  const toggleActive = async (t) => {
    const res = await updateTemplate(t.id, { is_active: !t.is_active });
    if (res.status === "success") load();
    else showToast(res.message, "error");
  };

  return (
    <div className="space-y-6">
      <Link to={`/admin/acara?tab=${eventType}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#4318FF]">
        <ArrowLeft className="h-4 w-4" /> Kembali ke jadwal
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2B3674]">Kelola Persyaratan</h1>
          <p className="text-sm text-gray-500">Perubahan berlaku untuk pendaftar baru; pendaftar lama tetap memakai daftar saat mereka mendaftar.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="h-10 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl font-bold"
        >
          <Plus className="h-4 w-4 mr-1" /> Tambah Syarat
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {EVENT_TYPE_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setParams({ tab: k })}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${k === eventType ? "bg-[#4318FF] text-white" : "bg-white text-[#2B3674] hover:bg-indigo-50"}`}
          >
            {EVENT_TYPES[k].label}
          </button>
        ))}
      </div>

      <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-50">
          <CardTitle className="text-lg font-bold text-[#2B3674]">Persyaratan {EVENT_TYPES[eventType].label}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-[#4318FF]" />
          ) : (
            <ul className="divide-y divide-gray-50">
              {templates.map((t, i) => (
                <li key={t.id} className={`py-3 flex items-start gap-3 ${t.is_active ? "" : "opacity-50"}`}>
                  <div className="flex flex-col">
                    <button disabled={i === 0} onClick={() => move(i, -1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-20" title="Naik">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button disabled={i === templates.length - 1} onClick={() => move(i, 1)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-20" title="Turun">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-[#2B3674]">{t.title}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#4318FF]">{CATEGORY_LABELS[t.category]}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {t.needs_upload ? "Unggah berkas" : "Dicentang admin"}
                      </span>
                      {!t.is_required && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Opsional</span>}
                      {!t.is_active && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">Nonaktif</span>}
                    </div>
                    {t.description && <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>}
                  </div>
                  <button
                    title="Ubah"
                    onClick={() => {
                      setEditing(t);
                      setDialogOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-[#2B3674]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    title={t.is_active ? "Nonaktifkan" : "Aktifkan"}
                    onClick={() => toggleActive(t)}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-[#2B3674]"
                  >
                    {t.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <TemplateDialog open={dialogOpen} onOpenChange={setDialogOpen} template={editing} eventType={eventType} onSaved={load} />
    </div>
  );
};

export default RequirementTemplates;
