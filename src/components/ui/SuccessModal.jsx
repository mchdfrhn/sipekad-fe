import { CheckCircle, XCircle } from "lucide-react";
import { motion as Motion } from "motion/react";

const SuccessModal = ({
  onOkHandler,
  text = "Pengajuan berhasil ditambahkan",
  isSuccess,
}) => {
  return (
    <>
      <div
        onClick={() => onOkHandler}
        className="fixed inset-0 bg-black/20 w-screen h-screen flex justify-center items-center z-40"
      >
        <Motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.1, ease: ["easeInOut"] }}
          className="bg-white rounded-md relative flex justify-center flex-col gap-8 px-8 w-xs md:w-md xl:w-xl py-10"
        >
          <div className="flex justify-center">
            <div className="size-20">
              {!isSuccess ? (
                <CheckCircle className="w-full text-green-500 h-full" />
              ) : (
                <XCircle className="w-full text-red-500 h-full " />
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl md:text-4xl font-semibold text-gray-800">
              {!isSuccess ? text : "Anda telah mengajuakn pengajuan yang sama"}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onOkHandler}
              className="border w-20 md:w-40 rounded-md py-1 cursor-pointer bg-blue-500 text-white border-transparent hover:bg-transparent hover:text-blue-500 hover:border-blue-500 transition-color duration-300 ease-in-out"
            >
              Ok
            </button>
          </div>
        </Motion.div>
      </div>
    </>
  );
};

export default SuccessModal;
