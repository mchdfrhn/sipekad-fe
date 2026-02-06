import Pengajuan from "../ui/Pengajuan";
import { penugasanDosenSkripsi } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";
import LinkTranskrip from "../ui/LinkTranskrip";

const DosenSkripsi = () => {
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const { syarat, title } = penugasanDosenSkripsi;
  const [err, setErr] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPengajuan(
      "Penugasan Dosen skripsi",
      message,
      file,
      setDisplayModal,
      displayModal,
      setIsLoading,
      setErr
    );
  };
  return (
    <>
      {displayModal && (
        <SuccessModal onOkHandler={() => setDisplayModal(!displayModal)} isSuccess={err} />
      )};
      <Pengajuan
        submitHandler={submitHandler}
        message={message}
        setMessage={setMessage}
        syarat={syarat}
        title={title}
        setFile={setFIle}
        isLoading={isLoading}
        children={<LinkTranskrip path={'/dashboard/request/suratpengajuan/judulskripsi'} content={"Link Pengajuan Judul Skripsi"} />}
      />
    </>
  );
};

export default DosenSkripsi;
