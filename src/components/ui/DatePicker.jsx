import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

// value: "YYYY-MM-DD" (date) or "YYYY-MM-DDTHH:mm" (withTime), always wall-clock WIB.
const parseValue = (value, withTime) => {
  if (!value) return null;
  const d = parse(value.slice(0, withTime ? 16 : 10), withTime ? "yyyy-MM-dd'T'HH:mm" : "yyyy-MM-dd", new Date());
  return Number.isNaN(d.getTime()) ? null : d;
};

const TimeSelect = ({ value, options, onChange, label }) => (
  <select
    aria-label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="appearance-none text-center w-16 px-2 py-2 bg-[#F4F7FE] text-[#2B3674] font-semibold text-sm rounded-xl outline-none focus:ring-2 focus:ring-[#4318FF] cursor-pointer"
  >
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

/**
 * Date (or date + time) picker styled like CustomSelect. Displays dd/mm/yyyy
 * regardless of browser locale.
 */
const DatePicker = ({ value, onChange, withTime = false, placeholder, required = false, clearable = false, className }) => {
  const selected = parseValue(value, withTime);
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(selected || new Date()));
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keep the calendar visible inside scrollable containers (e.g. dialogs).
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => popoverRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 160);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selected) setMonth(startOfMonth(selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
      }),
    [month],
  );

  const hour = selected ? format(selected, "HH") : "08";
  const minute = selected ? String(Math.floor(selected.getMinutes() / 5) * 5).padStart(2, "0") : "00";

  const emit = (day, h = hour, m = minute) => {
    const datePart = format(day, "yyyy-MM-dd");
    onChange(withTime ? `${datePart}T${h}:${m}` : datePart);
  };

  const pickDay = (day) => {
    emit(day);
    if (!withTime) setIsOpen(false);
  };

  const display = selected ? format(selected, withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy") : null;
  const today = new Date();

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {/* Keeps native form validation for required pickers */}
      <input
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        value={value || ""}
        onChange={() => {}}
        className="absolute inset-x-0 bottom-0 h-px opacity-0 pointer-events-none"
      />
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold text-sm rounded-2xl transition-all duration-200 outline-none focus:ring-2 focus:ring-[#4318FF] cursor-pointer",
          isOpen && "ring-2 ring-[#4318FF]",
        )}
      >
        <span className={cn("truncate", !display && "text-gray-400 font-normal")}>
          {display || placeholder || (withTime ? "dd/mm/yyyy --:--" : "dd/mm/yyyy")}
          {display && withTime && <span className="text-gray-400 font-medium"> WIB</span>}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {clearable && value && (
            <X
              role="button"
              aria-label="Kosongkan tanggal"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="h-4 w-4 text-gray-400 hover:text-red-500"
            />
          )}
          <CalendarDays className={cn("h-4 w-4 text-gray-400 transition-colors", isOpen && "text-[#4318FF]")} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-120 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                aria-label="Bulan sebelumnya"
                onClick={() => setMonth((m) => addMonths(m, -1))}
                className="p-1.5 rounded-lg hover:bg-gray-50 text-[#2B3674]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-bold text-[#2B3674] capitalize">
                {format(month, "MMMM yyyy", { locale: localeId })}
              </p>
              <button
                type="button"
                aria-label="Bulan berikutnya"
                onClick={() => setMonth((m) => addMonths(m, 1))}
                className="p-1.5 rounded-lg hover:bg-gray-50 text-[#2B3674]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((d) => (
                <span key={d} className="text-[10px] font-bold text-gray-400 uppercase py-1">{d}</span>
              ))}
              {days.map((day) => {
                const isSel = selected && isSameDay(day, selected);
                return (
                  <button
                    type="button"
                    key={day.toISOString()}
                    onClick={() => pickDay(day)}
                    className={cn(
                      "h-8 rounded-xl text-xs font-semibold transition-colors duration-150",
                      !isSameMonth(day, month) && "text-gray-300",
                      isSameMonth(day, month) && !isSel && "text-[#2B3674] hover:bg-indigo-50",
                      isSameDay(day, today) && !isSel && "ring-1 ring-[#4318FF]/40",
                      isSel && "bg-[#4318FF] text-white shadow-md shadow-indigo-500/20",
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
            {withTime && (
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400">Jam (WIB)</span>
                <div className="flex items-center gap-1">
                  <TimeSelect label="Jam" value={hour} options={HOURS} onChange={(h) => emit(selected || today, h, minute)} />
                  <span className="font-bold text-[#2B3674]">:</span>
                  <TimeSelect label="Menit" value={minute} options={MINUTES} onChange={(m) => emit(selected || today, hour, m)} />
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-xl bg-[#4318FF] text-white text-xs font-bold hover:bg-[#3311CC]"
                >
                  OK
                </button>
              </div>
            )}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
