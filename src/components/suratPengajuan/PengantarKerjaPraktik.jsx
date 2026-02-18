import { pengantarKp } from "../../utils/constant";
import LinkTranskrip from "../ui/LinkTranskrip";
import Pengajuan from "../ui/Pengajuan";
import { requestPengajuan } from "../../utils/action";
import { useState } from "react";
import { useToast } from "@/utils/hooks/useToast";
import { useNavigate } from "react-router";

const PengantarKerjaPraktik = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { syarat, url, fileName, title } = pengantarKp;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Pengantar Kerja Praktik",
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
        submitHandler={submitHandler}
        message={message}
        setMessage={setMessage}
        syarat={syarat}
        url={url}
        fileName={fileName}
        title={title}
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

export default PengantarKerjaPraktik;
