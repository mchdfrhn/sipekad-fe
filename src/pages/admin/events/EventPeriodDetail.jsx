import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { CalendarDays, Loader2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPeriod } from "@/utils/api/event";
import { EVENT_TYPES, PERIOD_STATE, formatDateTime } from "@/utils/eventConstants";
import { STATUS_LABEL_USER } from "@/utils/constant";
import PageHeader from "@/components/ui/PageHeader";

const EventPeriodDetail = () => {
  const { id } = useParams();
  const [period, setPeriod] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPeriod(id).then((res) => {
      if (res.status === "success") setPeriod(res.data);
      else setError(res.message);
    });
  }, [id]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!period) return <Loader2 className="h-6 w-6 animate-spin text-[#4318FF]" />;

  const st = PERIOD_STATE[period.state];
  return (
    <div className="space-y-6">
      <PageHeader
        backTo={`/admin/acara?tab=${period.event_type}`}
        backLabel="Kembali ke daftar gelombang"
        icon={CalendarDays}
        title={period.name}
        description={<>{EVENT_TYPES[period.event_type].label} · Pendaftaran {formatDateTime(period.registration_start)} – {formatDateTime(period.registration_end)}</>}
        actions={<span className={`text-xs font-bold px-3 py-1 rounded-full ${st.cls}`}>{st.label}</span>}
      />

      <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white overflow-hidden">
        <CardHeader className="border-b border-gray-50">
          <CardTitle className="text-lg font-bold text-[#2B3674] flex items-center gap-2">
            <Users className="h-5 w-5 text-[#4318FF]" /> Pendaftar ({period.registrants.length}
            {period.quota ? ` / ${period.quota}` : ""})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {period.registrants.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Belum ada pendaftar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 pr-4">Mahasiswa</th>
                    <th className="py-3 pr-4">Persyaratan</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Jadwal</th>
                  </tr>
                </thead>
                <tbody>
                  {period.registrants.map((r) => (
                    <tr key={r.id} className="border-t border-gray-50 align-top">
                      <td className="py-3 pr-4">
                        <Link to={`/admin/pengajuan/${r.id}`} className="font-bold text-[#2B3674] hover:text-[#4318FF]">
                          {r.full_name}
                        </Link>
                        <p className="text-xs text-gray-400">{r.nim} · {r.prodi}</p>
                      </td>
                      <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                        <b className="text-[#2B3674]">{r.approved_items}</b> / {r.total_items} sesuai
                        {r.submitted_items > 0 && <p className="text-xs text-blue-600">{r.submitted_items} menunggu diperiksa</p>}
                        {r.revision_items > 0 && <p className="text-xs text-orange-600">{r.revision_items} perlu revisi</p>}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{STATUS_LABEL_USER[r.status] || r.status}</td>
                      <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">
                        {r.scheduled_at ? (
                          <>
                            {formatDateTime(r.scheduled_at)}
                            <p className="text-xs text-gray-400">{r.room}</p>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventPeriodDetail;
