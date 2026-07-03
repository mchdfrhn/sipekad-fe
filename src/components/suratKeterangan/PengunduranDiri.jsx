import Pengajuan from "../ui/Pengajuan";
import { pengunduranDiri } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import { useNavigate } from "react-router";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const PengunduranDiri = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
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
    );

    if (result && result.status === "success") {
      showToast("Pengajuan berhasil dikirim", "success");
      setMessage("");
      setFile(null);
      if (result.pengajuanId) {
        navigate(`/dashboard/${result.pengajuanId}`);
      } else {
        navigate("/dashboard");
      }
    } else {
      showToast(result?.message || "Gagal mengirim pengajuan", "error");
    }
  };

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
      />
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={doSubmit}
        variant="warning"
        title="Konfirmasi Pengajuan"
        description="Apakah Anda yakin ingin mengajukan Pengunduran Diri? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Ajukan"
        cancelText="Batalkan"
      />
    </>
  );
};

export default PengunduranDiri;
