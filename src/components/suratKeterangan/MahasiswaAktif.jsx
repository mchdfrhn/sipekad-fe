import Pengajuan from "../ui/Pengajuan";
import { pengajuanMahasiswaAktif } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";

const MahasiswaAktif = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(false);
    await requestPengajuan(
      "Mahasiswa Aktif",
      message,
      file,
      setDisplayModal,
      displayModal,
      setLoading
    );
  };

  const { syarat, title, url, fileName } = pengajuanMahasiswaAktif;
  return (
    <>
      {displayModal && (
        <SuccessModal setDisplay={setDisplayModal} isDisplay={displayModal} />
      )}
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
