import Pengajuan from "../ui/Pengajuan";
import { yudisium } from "../../utils/constant";
import { useState } from "react";
import { useNavigate } from "react-router";
import { requestPengajuan } from "../../utils/action";
import BackLink from "../ui/BackLink";

const Yudisium = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    await requestPengajuan("yudisium", message, file, navigate);
  };
  const { title, syarat, url, fileName } = yudisium;
  return (
    <>
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
    />
    </>
  );
};

export default Yudisium;