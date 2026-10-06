import Pengajuan from "../ui/Pengajuan";
import { pengunduranDiri } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import { useNavigate } from "react-router";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Checkbox } from "../../components/ui/checkbox";
import { FileCheck2, FileX2 } from "lucide-react";

const PengunduranDiri = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [needsStatementLetter, setNeedsStatementLetter] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { title, syarat, url, fileName } = pengunduranDiri;

  const submitHandler = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const doSubmit = async () => {
    setIsLoading(true);
    const result = await requestPengajuan(
      "Pengunduran Diri",
      message,
      file,
      null,
      null,
      setIsLoading,
      null,
      { needs_statement_letter: needsStatementLetter },
    );

    if (result && result.status === "success") {
      showToast("Pengajuan berhasil dikirim", "success");
      setMessage("");
      setFile(null);
      setNeedsStatementLetter(false);
      if (result.pengajuanId) {
        navigate(`/dashboard/${result.pengajuanId}`);
      } else {
        navigate("/dashboard");
      }
    } else {
      showToast(result?.message || "Gagal mengirim pengajuan", "error");
    }
  };

  const additionalFields = (
    <div
      onClick={() => setNeedsStatementLetter((prev) => !prev)}
      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
        needsStatementLetter
          ? "border-[#4318FF] bg-[#4318FF]/5 shadow-sm"
          : "border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            id="needs-statement-letter"
            checked={needsStatementLetter}
            onCheckedChange={(checked) =>
              setNeedsStatementLetter(Boolean(checked))
            }
            className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-[#4318FF] data-[state=checked]:border-[#4318FF]"
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className="text-sm font-bold text-[#2B3674] flex items-center gap-1.5"
            >
              {needsStatementLetter ? (
                <FileCheck2 className="h-4 w-4 text-[#4318FF]" />
              ) : (
                <FileX2 className="h-4 w-4 text-gray-400" />
              )}
              Perlu Surat Keterangan Balasan
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                needsStatementLetter
                  ? "bg-[#4318FF]/10 text-[#4318FF]"
                  : "bg-gray-200/70 text-gray-500"
              }`}
            >
              {needsStatementLetter ? "Perlu Surat Balasan" : "Tanpa Surat Balasan"}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Centang jika Anda membutuhkan Surat Keterangan resmi bertanda tangan dari pihak kampus/fakultas sebagai bukti pengunduran diri.
          </p>
          {needsStatementLetter && (
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#4318FF]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4318FF]"></span>
              Admin akan menyiapkan dan melampirkan berkas surat keterangan saat memproses permohonan Anda.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Pengajuan
        submitHandler={submitHandler}
        message={message}
        setMessage={setMessage}
        url={url}
        syarat={syarat}
        title={title}
        fileName={fileName}
        setFile={setFile}
        file={file}
        isLoading={isLoading}
        additionalFields={additionalFields}
      />
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={doSubmit}
        variant="warning"
        title="Konfirmasi Pengajuan"
        description={
          needsStatementLetter
            ? "Apakah Anda yakin ingin mengajukan Pengunduran Diri dengan permintaan Surat Keterangan resmi? Tindakan ini tidak dapat dibatalkan."
            : "Apakah Anda yakin ingin mengajukan Pengunduran Diri (tanpa permintaan surat keterangan resmi)? Tindakan ini tidak dapat dibatalkan."
        }
        confirmText="Ya, Ajukan"
        cancelText="Batalkan"
      />
    </>
  );
};

export default PengunduranDiri;
