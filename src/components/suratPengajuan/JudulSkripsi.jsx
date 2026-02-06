import { judulSkripsi } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import SuccessModal from "../ui/SuccessModal";

const JudulSkripsi = () => {
  const [message, setMessage] = useState("");
  const [file, setFIle] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { syarat, title } = judulSkripsi;
  const [err, setErr] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPengajuan(
      "Judul Skripsi",
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
        <SuccessModal
          text={"Pengajuan berhasil ditambahkan"}
          onOkHandler={() => setDisplayModal(!displayModal)}
          isSuccess={err}
        />
      )}
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
            path={"/dashboard/request/transkripnilai"}
            content={" Link pengajuan transkrip nilai"}
          />
        }
      />
    </>
  );
};

export default JudulSkripsi;
