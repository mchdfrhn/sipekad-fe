import Pengajuan from "../ui/Pengajuan";
import { judulKerjaPraktik } from "../../utils/constant";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";

const KerjaPraktik = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const { syarat, url, title, fileName } = judulKerjaPraktik;
  const [displayModal, setDisplayModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    await requestPengajuan("Judul Kerja Praktik", message, file, setDisplayModal, displayModal, setLoading);
  };
  return (
    <>
    {
      displayModal && <SuccessModal isDisplay={displayModal} setDisplay={setDisplayModal} />
    }   
    <Pengajuan
      url={url}
      syarat={syarat}
      message={message}
      setMessage={setMessage}
      submitHandler={submitHandler}
      title={title}
      fileName={fileName}
      setFile={setFile}
      isLoading={loading}
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
