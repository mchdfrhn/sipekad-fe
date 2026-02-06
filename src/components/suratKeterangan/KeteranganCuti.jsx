import Pengajuan from "../ui/Pengajuan";
import { pengajuanCuti } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";

const KeteranganCuti = () => {
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const { url, syarat, title, fileName } = pengajuanCuti;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPengajuan(
      "Keterangan Cuti",
      message,
      file,
      setDisplayModal,
      displayModal,
      setIsLoading
    );
  };

  return (
    <>
      {displayModal && (
        <SuccessModal onOkHandler={() => setDisplayModal(!displayModal)} />
      )}
      <Pengajuan
        submitHandler={submitHandler}
        message={message}
        setMessage={setMessage}
        url={url}
        syarat={syarat}
        title={title}
        fileName={fileName}
        setFile={setFIle}
        isLoading={isLoading}
      />
    </>
  );
};

export default KeteranganCuti;
