import { seminarKerjaPraktik } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import { useToast } from "@/utils/hooks/useToast";
import BackLink from "../ui/BackLink";

const ChildrenSempro = () => {
  return (
    <>
      <LinkTranskrip
        path={"/dashboard/request/transkripnilai"}
        content={" Link pengajuan transkrip nilai"}
      />
      <LinkTranskrip
        path={"dashboard/request/suratpenugasan/dosentugasakhir"}
        content={"Link pengajuan surat penugasan dosen"}
      />
    </>
  );
};

const SeminarKp = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPengajuan(
      "Seminar Kp",
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
  const { syarat, title, url, fileName } = seminarKerjaPraktik;
  return (
    <>
      <BackLink />
      <Pengajuan
        message={message}
        setMessage={setMessage}
        submitHandler={submitHandler}
        syarat={syarat}
        url={url}
        fileName={fileName}
        title={title}
        setFile={setFile}
        children={<ChildrenSempro />}
        isLoading={isLoading}
      />
    </>
  );
};

export default SeminarKp;
