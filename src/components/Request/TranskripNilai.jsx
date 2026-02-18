import { transkripNilai } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan.jsx";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import BackLink from "../ui/BackLink.jsx";

const TranskripNilai = () => {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Transkrip Nilai",
      message,
      null,
      null,
      null,
      setIsLoading,
      null,
    );

    if (result && result.status === "success") {
      showToast("Pengajuan berhasil dikirim", "success");
      setMessage("");
    } else {
      showToast(result?.message || "Gagal mengirim pengajuan", "error");
    }
  };
  const { syarat, title } = transkripNilai;
  return (
    <>
      <BackLink />
      <Pengajuan
        message={message}
        setMessage={setMessage}
        submitHandler={submitHandler}
        syarat={syarat}
        title={title}
        isDisplay={true}
        isLoading={isLoading}
      />
    </>
  );
};

export default TranskripNilai;
