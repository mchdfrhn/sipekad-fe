import Pengajuan from "../ui/Pengajuan";
import { keteranganLulus } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import { useNavigate } from "react-router";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const KeteranganLulus = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { title, syarat } = keteranganLulus;

  const doSubmit = async () => {
    setIsLoading(true);
    const result = await requestPengajuan(
      "Keterangan Lulus",
      message,
      null,
      null, // setDisplayModal
      null, // displayModal
      setIsLoading,
      null, // setErr
    );

    if (result && result.status === "success") {
      showToast("Pengajuan berhasil dikirim", "success");
      setMessage("");
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
        syarat={syarat}
        title={title}
        isDisplay={true}
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

export default KeteranganLulus;
