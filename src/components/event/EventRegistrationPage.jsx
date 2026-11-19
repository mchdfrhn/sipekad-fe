import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion as Motion } from "motion/react";
import { CalendarDays, Loader2, Users, ClipboardList, ArrowRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackLink from "../ui/BackLink";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useToast } from "@/utils/hooks/useToast";
import { getPeriods, getTemplates, registerPeriod } from "@/utils/api/event";
import { EVENT_TYPES, PERIOD_STATE, formatDate, formatDateTime } from "@/utils/eventConstants";
import RequirementList from "./RequirementList";

const PeriodCard = ({ period, onRegister, isRegistering }) => {
  const state = PERIOD_STATE[period.state] || PERIOD_STATE.closed;
  const full = period.quota && period.registered_count >= period.quota;
  return (
    <div className="rounded-2xl border border-gray-100 p-5 space-y-4 bg-white">
      <div className="flex items-start justify-between gap-3">
        <p className="font-bold text-[#2B3674]">{period.name}</p>
        <span className={`shrink-0 text-[11px] font-bold px-3 py-1 rounded-full ${state.cls}`}>{state.label}</span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex gap-2">
          <ClipboardList className="h-4 w-4 text-[#4318FF] shrink-0 mt-0.5" />
          <span>
            Pendaftaran: <b>{formatDateTime(period.registration_start)}</b> s.d. <b>{formatDateTime(period.registration_end)}</b>
          </span>
        </p>
        {(period.event_start || period.event_end) && (
          <p className="flex gap-2">
            <CalendarDays className="h-4 w-4 text-[#4318FF] shrink-0 mt-0.5" />
            <span>
              Perkiraan pelaksanaan: <b>{formatDate(period.event_start)}</b>
              {period.event_end && period.event_end !== period.event_start && <> s.d. <b>{formatDate(period.event_end)}</b></>}
            </span>
          </p>
        )}
        {period.quota && (
          <p className="flex gap-2">
            <Users className="h-4 w-4 text-[#4318FF] shrink-0 mt-0.5" />
            <span>
              Kuota: <b>{Math.max(period.quota - period.registered_count, 0)}</b> dari {period.quota} tersisa
            </span>
          </p>
        )}
        {period.description && (
          <p className="flex gap-2 whitespace-pre-line">
            <Info className="h-4 w-4 text-[#4318FF] shrink-0 mt-0.5" />
            <span>{period.description}</span>
          </p>
        )}
      </div>
      {period.my_request_id ? (
        <Link
          to={`/dashboard/${period.my_request_id}`}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl bg-indigo-50 text-[#4318FF] font-bold text-sm hover:bg-indigo-100"
        >
          Lihat pendaftaran saya <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        period.state === "open" && (
          <Button
            disabled={isRegistering || full}
            onClick={() => onRegister(period)}
            className="w-full h-11 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-2xl font-bold"
          >
            {isRegistering ? <Loader2 className="h-5 w-5 animate-spin" /> : full ? "Kuota penuh" : "Daftar Sekarang"}
          </Button>
        )
      )}
    </div>
  );
};

const EventRegistrationPage = ({ eventType }) => {
  const meta = EVENT_TYPES[eventType];
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmPeriod, setConfirmPeriod] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [tpl, per] = await Promise.all([getTemplates(eventType), getPeriods(eventType)]);
    if (tpl.status === "success") setTemplates(tpl.data);
    if (per.status === "success") setPeriods(per.data);
    setIsLoading(false);
  }, [eventType]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRegister = async () => {
    const period = confirmPeriod;
    setConfirmPeriod(null);
    setIsRegistering(true);
    const result = await registerPeriod(period.id, "");
    setIsRegistering(false);
    if (result.status === "success") {
      showToast("Pendaftaran berhasil. Silakan lengkapi berkas persyaratan.", "success");
      navigate(`/dashboard/${result.pengajuanId}`);
    } else {
      showToast(result.message, "error");
      load();
    }
  };

  const visible = periods.filter((p) => p.state === "open" || p.state === "upcoming" || p.my_request_id);

  return (
    <>
      <BackLink />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7">
          <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 pb-6">
              <CardTitle className="text-xl font-bold text-[#2B3674]">Persyaratan {meta.label}</CardTitle>
              <p className="text-sm text-gray-500 font-medium pt-1">
                Setiap berkas diunggah terpisah setelah Anda mendaftar. Admin akan memeriksa satu per satu.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-[#4318FF]" /> : <RequirementList templates={templates} />}
            </CardContent>
          </Card>
        </Motion.div>

        <Motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
          <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white overflow-hidden">
            <CardHeader className="bg-[#4318FF]/5 pb-6">
              <CardTitle className="text-xl font-bold text-[#2B3674] flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#4318FF]" />
                Jadwal Pendaftaran
              </CardTitle>
              <p className="text-sm text-gray-500 font-medium mt-1">{meta.label}</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#4318FF]" />
              ) : visible.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Belum ada jadwal pendaftaran yang dibuka. Pantau halaman ini secara berkala.
                </p>
              ) : (
                visible.map((p) => (
                  <PeriodCard key={p.id} period={p} onRegister={setConfirmPeriod} isRegistering={isRegistering} />
                ))
              )}
            </CardContent>
          </Card>
        </Motion.div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmPeriod}
        onClose={() => setConfirmPeriod(null)}
        title={`Daftar ${meta.label}?`}
        description={confirmPeriod ? `Anda akan mendaftar ke "${confirmPeriod.name}". Setelah itu, unggah berkas persyaratan di halaman pendaftaran.` : ""}
        confirmText="Daftar"
        variant="primary"
        onConfirm={handleRegister}
      />
    </>
  );
};

export default EventRegistrationPage;
