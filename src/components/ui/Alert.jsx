import { HelpCircle, X } from "lucide-react";
import { motion } from "motion/react"

const Alert = ({ setDisplay, onYesHundler, isDisplay }) => {
  return (
    <>
      <div onClick={() => setDisplay(!isDisplay)} className="fixed inset-0 bg-black/20 w-screen z-40 h-screen flex justify-center items-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.1, ease: ["easeInOut"] }} className="bg-white rounded-md w-xs relative flex justify-center flex-col gap-8 px-8 w-xs md:w-md xl:w-xl py-10">
            <div className="flex justify-center">
                <div className="size-20">
                    <HelpCircle className="w-full h-full text-red-500" />
                </div>
            </div>
            <div className="text-center">
                <p className="text-2xl md:text-4xl font-semibold text-gray-800">Apakah kamu yakin?</p>
            </div>
            <div className="flex justify-center gap-4">
                <button onClick={onYesHundler} className="border w-20 md:w-40 rounded-md py-1 cursor-pointer bg-blue-500 text-white border-transparent hover:bg-transparent hover:text-blue-500 hover:border-blue-500 transition-color duration-300 ease-in-out">Ya</button>
                <button onClick={() => setDisplay(!isDisplay)} className="border w-20 md:w-40 rounded-md py-1 cursor-pointer bg-red-500 text-white border-transparent hover:bg-transparent hover:text-red-500 hover:border-red-500 transition-color duration-300 ease-in-out">No</button>
            </div>
        </motion.div>
      </div>
    </>
  );
};

export default Alert;
