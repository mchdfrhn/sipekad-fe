import Pengajuan from "../ui/Pengajuan";
import { pengajuanCuti } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";

const KeteranganCuti = () => {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { url, syarat, title, fileName } = pengajuanCuti;

  const submitHandler = async (e) => {
    e.preventDefault();
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
      setFIle(null);
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
        setFile={setFIle}
        isLoading={isLoading}
      />
    </>
  );
};

export default KeteranganCuti;
