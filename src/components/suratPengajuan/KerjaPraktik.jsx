import Pengajuan from "../ui/Pengajuan";
import { judulKerjaPraktik } from "../../utils/constant";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import { useNavigate } from "react-router";

const KerjaPraktik = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { syarat, url, title, fileName } = judulKerjaPraktik;
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Judul Kerja Praktik",
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
        navigate(`/dashboard/pengajuan-${result.pengajuanId}`);
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
        url={url}
        syarat={syarat}
        message={message}
        setMessage={setMessage}
        submitHandler={submitHandler}
        title={title}
        fileName={fileName}
        setFile={setFile}
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

export default KerjaPraktik;
