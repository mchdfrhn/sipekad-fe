import { useCallback, useEffect, useMemo, useState } from "react";
import { ShieldCheck, Save, RefreshCw } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/Loading";
import { useToast } from "@/utils/hooks/useToast";
import { getRequestAccessMatrix, saveRequestAccessMatrix } from "@/utils/api/requestAccess";

const cellKey = (type, prodi) => `${type}|${prodi}`;

// { "Jenis|Prodi": boolean } dari data server
const toDraft = (types) => {
  const draft = {};
  types.forEach((t) => Object.entries(t.access).forEach(([prodi, ok]) => (draft[cellKey(t.type, prodi)] = ok)));
  return draft;
};

const RequestAccess = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null); // { prodi: [], types: [] } terakhir dari server
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const apply = useCallback((payload) => {
    setData(payload);
    setDraft(toDraft(payload.types));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getRequestAccessMatrix();
    if (res.status === "success") apply(res.data);
    else showToast(res.message, "error");
    setLoading(false);
  }, [apply, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const saved = useMemo(() => (data ? toDraft(data.types) : {}), [data]);

  // Hanya kombinasi yang berubah yang dikirim ke server.
  const changes = useMemo(() => {
    if (!data) return [];
    const out = [];
    data.types.forEach((t) =>
      data.prodi.forEach((prodi) => {
        const k = cellKey(t.type, prodi);
        if (draft[k] !== saved[k]) out.push({ request_type: t.type, prodi, is_enabled: draft[k] });
      }),
    );
    return out;
  }, [data, draft, saved]);

  const groups = useMemo(() => {
    const map = new Map();
    (data?.types || []).forEach((t) => {
      if (!map.has(t.group)) map.set(t.group, []);
      map.get(t.group).push(t);
    });
    return [...map.entries()];
  }, [data]);

  const toggle = (type, prodi, value) =>
    setDraft((prev) => ({ ...prev, [cellKey(type, prodi)]: value === true }));

  const toggleColumn = (prodi, value) =>
    setDraft((prev) => {
      const next = { ...prev };
      data.types.forEach((t) => (next[cellKey(t.type, prodi)] = value));
      return next;
    });

  const save = async () => {
    setSaving(true);
    const res = await saveRequestAccessMatrix(changes);
    setSaving(false);
    if (res.status === "success") {
      apply(res.data);
      showToast("Pengaturan akses berhasil disimpan", "success");
    } else {
      showToast(res.message, "error");
    }
  };

  const columnState = (prodi) => {
    const values = data.types.map((t) => draft[cellKey(t.type, prodi)]);
    if (values.every(Boolean)) return true;
    if (values.some(Boolean)) return "indeterminate";
    return false;
  };

  return (
    <div className="space-y-4">
      <PageHeader
        icon={ShieldCheck}
        title="Akses Pengajuan"
        description="Centang jenis pengajuan yang tersedia di SIPEKAD untuk tiap program studi. Yang tidak dicentang tidak muncul di menu mahasiswa prodi tersebut."
        actions={
          <>
            <Button variant="outline" onClick={load} disabled={loading || saving}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Muat Ulang
            </Button>
            <Button onClick={save} disabled={loading || saving || changes.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Menyimpan..." : changes.length ? `Simpan (${changes.length})` : "Simpan"}
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading || !data ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-4 font-bold text-[#2B3674]">Jenis Pengajuan</th>
                  {data.prodi.map((prodi) => (
                    <th key={prodi} className="px-4 py-4 text-center font-bold text-[#2B3674] min-w-[130px]">
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        {prodi}
                        <Checkbox
                          checked={columnState(prodi)}
                          onCheckedChange={(v) => toggleColumn(prodi, v === true)}
                          aria-label={`Pilih semua untuk ${prodi}`}
                        />
                      </label>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map(([group, rows]) => (
                  <GroupRows
                    key={group}
                    group={group}
                    rows={rows}
                    prodi={data.prodi}
                    draft={draft}
                    saved={saved}
                    onToggle={toggle}
                  />
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-[#718096]">
        Pengaturan hanya menutup pengajuan baru. Pengajuan yang sudah masuk tidak berubah.
      </p>
    </div>
  );
};

const GroupRows = ({ group, rows, prodi, draft, saved, onToggle }) => (
  <>
    <tr className="bg-[#F4F7FE]">
      <td colSpan={prodi.length + 1} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        {group}
      </td>
    </tr>
    {rows.map((t) => (
      <tr key={t.type} className="border-b border-gray-50 last:border-0">
        <td className="px-5 py-3 font-medium text-[#2B3674]">{t.label}</td>
        {prodi.map((p) => {
          const k = cellKey(t.type, p);
          return (
            <td key={p} className={`px-4 py-3 text-center ${draft[k] !== saved[k] ? "bg-amber-50" : ""}`}>
              <Checkbox
                checked={draft[k] === true}
                onCheckedChange={(v) => onToggle(t.type, p, v)}
                aria-label={`${t.label} untuk ${p}`}
              />
            </td>
          );
        })}
      </tr>
    ))}
  </>
);

export default RequestAccess;
