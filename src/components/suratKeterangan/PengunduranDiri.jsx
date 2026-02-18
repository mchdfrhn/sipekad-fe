import Pengajuan from "../ui/Pengajuan";
import { pengunduranDiri } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";

const PengunduranDiri = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const { title, syarat, url, fileName } = pengunduranDiri;
  const submitHandler = async (e) => {
    e.preventDefault();
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

export default PengunduranDiri;
