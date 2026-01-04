import { pengantarKp } from "../../utils/constant";
import LinkTranskrip from "../ui/LinkTranskrip";
import Pengajuan from "../ui/Pengajuan";
import { requestPengajuan } from "../../utils/action";
import { useState } from "react";
import SuccessModal from "../ui/SuccessModal";

const PengantarKerjaPraktik = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setIsDisplayModal] = useState(false);
  const { syarat, url, fileName, title } = pengantarKp;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPengajuan(
      "Pengantar Kerja Praktik",
      message,
      file,
      setIsDisplayModal,
      displayModal,
      setIsLoading
    );
  };
  return (
    <>
      {displayModal && (
        <SuccessModal isDisplay={displayModal} setDisplay={setIsDisplayModal} />
      )}
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
