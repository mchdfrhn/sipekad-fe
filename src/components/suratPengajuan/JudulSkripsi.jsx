import { judulSkripsi } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";

const JudulSkripsi = () => {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { syarat, title } = judulSkripsi;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Judul Skripsi",
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
        syarat={syarat}
        title={title}
        setFile={setFIle}
        isLoading={isLoading}
        children={
          <LinkTranskrip
            path={"/dashboard/request/transkripnilai"}
            content={" Link pengajuan transkrip nilai"}
          />
        }
      />
    </>
  );
};

export default JudulSkripsi;
