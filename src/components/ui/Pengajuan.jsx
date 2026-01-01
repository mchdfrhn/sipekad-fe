import { useState } from "react";
import Syarat from "./Syarat";
import { motion } from "motion/react"

const Pengajuan = ({
  url,
  syarat,
  title,
  fileName,
  children,
  isDisplay,
  submitHandler,
  message,
  setMessage,
  placeholder,
  setFile
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [maxMessage, setMaxMessage] = useState(0);

  const handlerDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName ? fileName : "";
    link.click();
  };

  const handleChange = (e) => {
    if (e.target.value.length <= 200) {
      setMaxMessage(e.target.value.length);
      setMessage(e.target.value)
    }
  }

  const handlerPreview = () => {
    setShowPreview((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Syarat
        syarat={syarat}
        title={title}
        handlerDownload={handlerDownload}
        handlerPreview={handlerPreview}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        url={url}
        children={children}
      />

      <motion.div initial={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 0.5, ease: ['easeInOut'] }} className="card-pengajuan order-3 md:order-1">
        <h2 className="text-xl text-slate-800 font-semibold mb-8">
          Informasi Pengaju
        </h2>
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4"
          action=""
        >
          <div>
            <small className="text-gray-800">{maxMessage}/200</small>
            <input
              required  
              type="text"
              className="input-pengajuan"
              placeholder={placeholder ? placeholder : "message"}
              value={message}
              onChange={handleChange}
            />
          </div>
          {!isDisplay && <input type="file" name="file" onChange={(e) => setFile(e.target.files[0])} className="input-pengajuan" />}
          <button className="text-sm bg-yellow-500 text-slate-900 border-transparent hover:bg-transparent hover:border-slate-900 transition-colors duration-animation border-2 font-[500] px-4 cursor-pointer py-1 rounded-md">
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Pengajuan;
