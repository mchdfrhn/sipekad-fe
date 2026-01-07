import Pengajuan from "../ui/Pengajuan";
import { pengunduranDiri } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";

const PengunduranDiri = () => {
  const [isLoading, setLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const { title, syarat, url, fileName } = pengunduranDiri;
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await requestPengajuan(
      "Pengunduran diri",
      message,
      file,
      setDisplayModal,
      displayModal,
      setLoading
    );
  };
  return (
    <>
      {displayModal && (
        <SuccessModal isDisplay={displayModal} setDisplay={setDisplayModal} />
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

export default PengunduranDiri;
