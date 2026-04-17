import Pengajuan from "../ui/Pengajuan";
import { penugasanDosenSkripsi } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useNavigate } from "react-router";

const DosenSkripsi = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { syarat, title } = penugasanDosenSkripsi;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Penugasan Dosen Skripsi",
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
        syarat={syarat}
        title={title}
        setFile={setFile}
        file={file}
        isLoading={isLoading}
        children={
          <LinkTranskrip
            path={"/dashboard/request/suratpengajuan/judulskripsi"}
            content={"Link Pengajuan Judul Skripsi"}
          />
        }
      />
    </>
  );
};

export default DosenSkripsi;
