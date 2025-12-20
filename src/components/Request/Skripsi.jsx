import { sidangSkripsi } from "../../utils/constant";
import Pengajuan from "../ui/Pengajuan";
import LinkTranskrip from "../ui/LinkTranskrip";
import { useState } from "react";
import { useNavigate } from "react-router";
import { requestPengajuan } from "../../utils/action";
import BackLink from "../ui/BackLink";

const ChildrenSempro = () => {
  return (
    <>
      <LinkTranskrip
        path={"/dashboard/request/transkripnilai"}
        content={" Link pengajuan transkrip nilai"}
      />
      <LinkTranskrip
        path={"dashboard/request/suratpenugasan/dosentugasakhir"}
        content={"Link pengajuan surat penugasan dosen"}
      />
    </>
  );
};

const Skripsi = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    await requestPengajuan("Sidang skripsi", message, file, navigate);
  };
  const { syarat, title, url, fileName } = sidangSkripsi;
  return (
    <>
    <BackLink />
    <Pengajuan
      message={message}
      setMessage={setMessage}
      submitHandler={submitHandler}
      syarat={syarat}
      url={url}
      fileName={fileName}
      title={title}
      setFile={setFile}
      children={<ChildrenSempro />}
    />
    </>
  );
};

export default Skripsi;
