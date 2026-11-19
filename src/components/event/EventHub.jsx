import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { Presentation, UserCheck, BookOpenCheck, Award, ArrowRight, CalendarClock, CheckCircle2, Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { getPeriods, getTemplates } from "@/utils/api/event";
import { EVENT_TYPES, EVENT_TYPE_KEYS, EVENT_ROUTES, PERIOD_STATE, formatDate } from "@/utils/eventConstants";

const META = {
  seminar_kp: { icon: UserCheck, tone: "bg-teal-50 text-teal-600", desc: "Seminar hasil Kerja Praktik setelah KP selesai dan disetujui pembimbing." },
  seminar_skripsi: { icon: BookOpenCheck, tone: "bg-orange-50 text-orange-500", desc: "Seminar proposal skripsi (Sempro) dengan pembimbing 1 dan 2." },
  sidang_skripsi: { icon: Award, tone: "bg-violet-50 text-violet-600", desc: "Sidang akhir skripsi. Pastikan tidak ada nilai D dan E." },
};

// Pick the wave a student cares about most: their own registration, then an open one, then the next upcoming.
const pickPeriod = (periods) =>
  periods.find((p) => p.my_request_id) ||
  periods.find((p) => p.state === "open") ||
  periods
    .filter((p) => p.state === "upcoming")
    .sort((a, b) => new Date(a.registration_start) - new Date(b.registration_start))[0] ||
  null;

const EventCard = ({ eventType, index }) => {
  const [data, setData] = useState(null);
  const meta = META[eventType];
  const Icon = meta.icon;

  useEffect(() => {
    Promise.all([getPeriods(eventType), getTemplates(eventType)]).then(([per, tpl]) => {
      setData({
        period: per.status === "success" ? pickPeriod(per.data) : null,
        requirementCount: tpl.status === "success" ? tpl.data.length : 0,
      });
    });
  }, [eventType]);

  const period = data?.period;
  const state = period ? PERIOD_STATE[period.state] : null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Link
        to={period?.my_request_id ? `/dashboard/${period.my_request_id}` : EVENT_ROUTES[eventType]}
        className="group flex h-full flex-col gap-4 rounded-[20px] bg-white p-6 shadow-[0_4px_24px_rgba(67,24,255,0.06)] border border-gray-100/80 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(67,24,255,0.12)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${meta.tone}`}>
            <Icon className="h-6 w-6" />
          </div>
          {state && <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${state.cls}`}>{state.label}</span>}
        </div>

        <div className="space-y-1">
          <p className="text-lg font-bold text-[#2B3674]">{EVENT_TYPES[eventType].label}</p>
          <p className="text-sm text-[#718096]">{meta.desc}</p>
        </div>

        <div className="mt-auto space-y-2 text-sm">
          {!data ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#4318FF]" />
          ) : (
            <>
              {period?.my_request_id ? (
                <p className="flex items-center gap-2 font-bold text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> Anda sudah terdaftar di {period.name}
                </p>
              ) : period ? (
                <p className="flex items-center gap-2 text-[#2B3674]">
                  <CalendarClock className="h-4 w-4 text-[#4318FF] shrink-0" />
                  <span>
                    <b>{period.name}</b> · {formatDate(period.registration_start)} – {formatDate(period.registration_end)}
                  </span>
                </p>
              ) : (
                <p className="flex items-center gap-2 text-gray-400">
                  <CalendarClock className="h-4 w-4 shrink-0" /> Belum ada jadwal pendaftaran
                </p>
              )}
              <p className="text-xs text-gray-400">{data.requirementCount} persyaratan</p>
            </>
          )}
          <p className="flex items-center gap-1 pt-2 text-sm font-bold text-[#4318FF]">
            {period?.my_request_id ? "Lihat pendaftaran" : "Lihat persyaratan & daftar"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </Link>
    </Motion.div>
  );
};

const EventHub = () => (
  <div>
    <PageHeader
      icon={Presentation}
      title="Seminar & Sidang"
      description="Daftar Seminar KP, Seminar Skripsi, dan Sidang Skripsi, lalu unggah berkas persyaratan per item."
    />
    <div className="grid gap-6 md:grid-cols-3">
      {EVENT_TYPE_KEYS.map((key, i) => (
        <EventCard key={key} eventType={key} index={i} />
      ))}
    </div>
  </div>
);

export default EventHub;
