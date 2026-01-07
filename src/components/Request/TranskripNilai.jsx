import { transkripNilai } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan.jsx";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import BackLink from "../ui/BackLink.jsx";
import SuccessModal from "../ui/SuccessModal.jsx";

const TranskripNilai = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPengajuan(
      "Transkrip nilai",
      message,
      null,
      setDisplayModal,
      displayModal,
      setIsLoading
    );
  };
  const { syarat, title } = transkripNilai;
  return (
    <>
      {displayModal && (
        <SuccessModal isDisplay={displayModal} setDisplay={setDisplayModal} />
      )}
      <BackLink />
      <Pengajuan
        message={message}
        setMessage={setMessage}
        submitHandler={submitHandler}
        syarat={syarat}
        title={title}
        isDisplay={true}
        isLoading={isLoading}
      />
    </>
  );
};

export default TranskripNilai;
