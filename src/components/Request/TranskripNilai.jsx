import { transkripNilai } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan.jsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { requestPengajuan } from "../../utils/action";
import BackLink from "../ui/BackLink.jsx"

const TranskripNilai = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const submitHandler = async (e) => {
    e.preventDefault();
    await requestPengajuan("Transkrip nilai", message, null, navigate);
  };
  const { syarat, title } = transkripNilai;
  return (
    <>
    <BackLink />
    <Pengajuan
      message={message}
      setMessage={setMessage}
      submitHandler={submitHandler}
      syarat={syarat}
      title={title}
      isDisplay={true}
    />
    </>
  );
};

export default TranskripNilai;
