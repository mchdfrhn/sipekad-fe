import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { Megaphone, ArrowRight, CalendarClock, GraduationCap } from "lucide-react";
import { getOpenPeriods } from "@/utils/api/event";
import { EVENT_ROUTES, formatDate, formatDateTime } from "@/utils/eventConstants";

/** Announces seminar/sidang registrations that are currently open. Renders nothing when none are. */
const OpenEventsBanner = () => {
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    getOpenPeriods().then((res) => {
      if (res.status === "success") setPeriods(res.data);
    });
  }, []);

  if (periods.length === 0) return null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] bg-white border border-indigo-100 shadow-[0_4px_24px_rgba(67,24,255,0.06)] p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-[#4318FF]/10 text-[#4318FF] flex items-center justify-center">
          <Megaphone className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-[#2B3674]">Pendaftaran sedang dibuka</p>
          <p className="text-xs text-[#718096]">Segera daftar dan lengkapi persyaratan sebelum batas waktu.</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {periods.map((p) => {
          const left = p.quota ? Math.max(p.quota - p.registered_count, 0) : null;
          return (
            <Link
              key={p.id}
              to={EVENT_ROUTES[p.event_type]}
              className="group flex items-center justify-between gap-3 rounded-2xl bg-[#F4F7FE] px-4 py-3 hover:bg-indigo-50 transition-colors"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-bold text-[#2B3674] truncate">
                  {p.label} · {p.name}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[#718096]">
                  <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                  Ditutup {formatDateTime(p.registration_end)}
                  {p.event_start && <> · pelaksanaan mulai {formatDate(p.event_start)}</>}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[#718096]">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                  {p.prodi || "Semua program studi"}
                  {left !== null && <> · sisa kuota {left}</>}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#4318FF] transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </Motion.div>
  );
};

export default OpenEventsBanner;
