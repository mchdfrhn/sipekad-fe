import Pengajuan from "../ui/Pengajuan";
import { keteranganLulus } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";

const KeteranganLulus = () => {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { title, syarat } = keteranganLulus;

  const submitHandler = async (e) => {
    e.preventDefault();
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
        syarat={syarat}
        title={title}
        isDisplay={true}
        isLoading={isLoading}
      />
    </>
  );
};

export default KeteranganLulus;
