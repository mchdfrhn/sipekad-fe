import Pengajuan from "../ui/Pengajuan";
import { pengajuanCuti } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import { useNavigate } from "react-router";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const KeteranganCuti = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { url, syarat, title, fileName } = pengajuanCuti;

  const doSubmit = async () => {
    setIsLoading(true);
    const result = await requestPengajuan(
      "Keterangan Cuti",
      message,
      file,
      null, // setDisplayModal
      null, // displayModal
      setIsLoading,
      null, // setErr
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

  const submitHandler = (e) => {
    e.preventDefault();
    setShowConfirm(true);
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
        variant="primary"
        title="Konfirmasi Pengajuan"
        description="Apakah Anda yakin ingin mengirimkan pengajuan ini?"
        confirmText="Ya, Kirim"
        cancelText="Batalkan"
      />
    </>
  );
};

export default KeteranganCuti;
