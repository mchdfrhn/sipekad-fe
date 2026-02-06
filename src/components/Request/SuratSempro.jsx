import { sempro } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import BackLink from "../ui/BackLink";
import SuccessModal from "../ui/SuccessModal";

const ChildrenSempro = () => {
  return (
    <>
      <LinkTranskrip
        path={"/dashboard/request/transkripnilai"}
        content={" Link pengajuan transkrip nilai"}
      />
      <LinkTranskrip
        path={"/dashboard/request/suratpenugasan/dosentugasakhir"}
        content={"Link pengajuan surat penugasan dosen"}
      />
    </>
  );
};

const SuratSempro = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [err, setErr] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPengajuan(
      "Surat Sempro",
      message,
      file,
      setDisplayModal,
      displayModal,
      setIsLoading,
      setErr
    );
  };
  
  const { syarat, title, url, fileName } = sempro;
  return (
    <>
      {displayModal && (
        <SuccessModal onOkHandler={() => setDisplayModal(!displayModal)} isSuccess={err} />
      )}
      <BackLink />
      <Pengajuan
        message={message}
        setMessage={setMessage}
        submitHandler={submitHandler}
        syarat={syarat}
        url={url}
        fileName={fileName}
        title={title}
        isDisplay={false}
        setFile={setFile}
        children={<ChildrenSempro />}
        isLoading={isLoading}
      />
    </>
  );
};

export default SuratSempro;
