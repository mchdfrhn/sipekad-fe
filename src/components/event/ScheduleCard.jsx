import { CalendarCheck2, MapPin, UserRound, Users, StickyNote } from "lucide-react";
import { formatDateTime } from "@/utils/eventConstants";

const Row = ({ icon, label, value }) => {
  const Icon = icon;
  return value ? (
    <div className="flex gap-3">
      <Icon className="h-4 w-4 text-[#4318FF] shrink-0 mt-0.5" />
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-[#2B3674] whitespace-pre-line">{value}</p>
      </div>
    </div>
  ) : null;
};

const ScheduleCard = ({ schedule }) => {
  if (!schedule) return null;
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5 space-y-4">
      <p className="text-sm font-bold text-green-700 flex items-center gap-2">
        <CalendarCheck2 className="h-5 w-5" /> Jadwal Final
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Row icon={CalendarCheck2} label="Waktu" value={formatDateTime(schedule.scheduled_at)} />
        <Row icon={MapPin} label="Ruang" value={schedule.room} />
        <Row icon={UserRound} label="Pembimbing" value={schedule.supervisor_names} />
        <Row icon={Users} label="Penguji" value={schedule.examiner_names} />
        <Row icon={StickyNote} label="Catatan" value={schedule.notes} />
      </div>
    </div>
  );
};

export default ScheduleCard;
