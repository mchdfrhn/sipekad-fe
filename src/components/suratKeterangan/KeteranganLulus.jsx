import Pengajuan from "../ui/Pengajuan";
import { keteranganLulus } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";

const KeteranganLulus = () => {
  const [message, setMessage] = useState("");
  const [displayModal, setDisplayModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { syarat, title } = keteranganLulus;
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await requestPengajuan(
      "Keterangan lulus",
      message,
      null,
      setDisplayModal,
      displayModal,
      setLoading
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
        syarat={syarat}
        title={title}
        isDisplay={true}
        isLoading={isLoading}
      />
    </>
  );
};

export default KeteranganLulus;
