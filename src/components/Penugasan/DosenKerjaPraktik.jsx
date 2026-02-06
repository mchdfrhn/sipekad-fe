import Pengajuan from "../ui/Pengajuan";
import { penugasanDosenKerjaPraktik } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";
import LinkTranskrip from "../ui/LinkTranskrip";
const DosenKerjaPraktik = () => {
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const { syarat, title } = penugasanDosenKerjaPraktik;

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
    );
  };
  return (
    <>
      {displayModal && (
        <SuccessModal onOkHandler={() => setDisplayModal(!displayModal)} />
      )}
      ;
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
            path={"/dashboard/request/suratpengajuan/kerjapraktik"}
            content={"Link Pengajuan Judul Kerja Praktik"}
          />
        }
      />
    </>
  );
};

export default DosenKerjaPraktik;
