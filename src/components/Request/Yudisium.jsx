import Pengajuan from "../ui/Pengajuan";
import { yudisium } from "../../utils/constant";
import { useState } from "react";
import { requestPengajuan } from "../../utils/action";
import BackLink from "../ui/BackLink";
import SuccessModal from "../ui/SuccessModal";

const Yudisium = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await requestPengajuan("yudisium", message, file, setDisplayModal, displayModal, setIsLoading);
  };
  const { title, syarat, url, fileName } = yudisium;
  return (
    <>
    {
      displayModal && <SuccessModal setDisplay={setDisplayModal} isDisplay={displayModal} />
    }
    <BackLink />
    <Pengajuan
      message={message}
      setMessage={setMessage}
      submitHandler={submitHandler}
      title={title}
      syarat={syarat}
      url={url}
      fileName={fileName}
      setFile={setFile}
      isLoading={isLoading}
    />
    </>
  );
};

export default Yudisium;