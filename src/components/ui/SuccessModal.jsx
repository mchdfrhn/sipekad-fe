import { CheckCircle, XCircle } from "lucide-react";
import { motion as Motion } from "motion/react";
import { overlayMotion, modalMotion } from "@/lib/motion";

const SuccessModal = ({
  onOkHandler,
  text = "Pengajuan berhasil ditambahkan",
  isSuccess,
}) => {
  return (
    <>
      {/* backdrop — onClick panggil handler, bukan referensi */}
      <Motion.div
        {...overlayMotion}
        onClick={onOkHandler}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm w-screen h-screen flex justify-center items-center z-50"
      >
        <Motion.div
          {...modalMotion}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[20px] relative flex justify-center flex-col gap-8 px-8 w-[min(20rem,calc(100vw-2rem))] md:w-[420px] py-10 shadow-xl"
        >
          <div className="flex justify-center">
            <div className="size-20">
              {/* logic diperbaiki: isSuccess=true → ✅, false → ✗ */}
              {isSuccess ? (
                <CheckCircle className="w-full text-green-500 h-full" />
              ) : (
                <XCircle className="w-full text-red-500 h-full" />
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-semibold text-gray-800">
              {isSuccess ? text : "Anda telah mengajukan pengajuan yang sama"}
            </p>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onOkHandler}
              className="border w-28 md:w-40 rounded-2xl py-2.5 cursor-pointer bg-[#4318FF] text-white border-transparent hover:bg-transparent hover:text-[#4318FF] hover:border-[#4318FF] transition-all duration-300 font-bold"
            >
              OK
            </button>
          </div>
        </Motion.div>
      </Motion.div>
    </>
  );
};

export default SuccessModal;
