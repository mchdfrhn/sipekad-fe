import Pengajuan from "../ui/Pengajuan";
import { pengajuanMahasiswaAktif } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";

const MahasiswaAktif = () => {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Mahasiswa Aktif",
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
    } else {
      showToast(result?.message || "Gagal mengirim pengajuan", "error");
    }
  };

  const { syarat, title, url, fileName } = pengajuanMahasiswaAktif;
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
        isLoading={isLoading}
      />
    </>
  );
};

export default MahasiswaAktif;
