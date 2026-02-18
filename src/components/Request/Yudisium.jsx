import Pengajuan from "../ui/Pengajuan";
import { yudisium } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import BackLink from "../ui/BackLink";

const Yudisium = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Yudisium",
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
    } else {
      showToast(result?.message || "Gagal mengirim pengajuan", "error");
    }
  };
  const { title, syarat, url, fileName } = yudisium;
  return (
    <>
      <BackLink />
      <Pengajuan
        message={message}
        setMessage={setMessage}
        submitHandler={submitHandler}
        title={title}
        syarat={syarat}
        url={url}
        fileName={fileName}
        setFile={setFile}
        isLoading={isLoading}
      />
    </>
  );
};

export default Yudisium;
