import { useState } from "react";
import Syarat from "./Syarat";
import { Loader2, FileText, Upload } from "lucide-react";
import { motion as Motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  setFile,
  file,
  isLoading,
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
      setMessage(e.target.value);
    }
  };

  const handlerPreview = () => {
    setShowPreview((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Requirements */}
      <div className="lg:col-span-7">
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
      </div>

      {/* Right Column: Form */}
      <Motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="lg:col-span-5"
      >
        <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white border-gray-100 overflow-hidden">
          <CardHeader className="bg-[#4318FF]/5 pb-6">
            <CardTitle className="text-xl font-bold text-[#2B3674] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#4318FF]" />
              Form Pengajuan
            </CardTitle>
            <p className="text-sm text-gray-500 font-medium">
              Silahkan isi informasi berikut dengan benar
            </p>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-[#2B3674]">
                    Pesan / Keterangan
                  </label>
                  <span
                    className={`text-[10px] font-bold ${maxMessage >= 180 ? "text-red-500" : "text-gray-400"}`}
                  >
                    {maxMessage}/200
                  </span>
                </div>
                <textarea
                  required
                  placeholder={
                    placeholder || "Berikan alasan atau keterangan singkat..."
                  }
                  value={message}
                  onChange={handleChange}
                  className="w-full min-h-[120px] px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#4318FF] transition-all outline-none text-sm font-medium resize-none"
                />
              </div>

              {!isDisplay && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#2B3674] ml-1">
                    Upload Berkas (PDF)
                  </label>
                  <div className="relative group">
                    <input
                      required
                      type="file"
                      name="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                      className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-dashed ${file ? "border-[#4318FF] bg-indigo-50/30" : "border-gray-200"} rounded-2xl group-hover:border-[#4318FF] group-hover:bg-indigo-50/30 transition-all`}
                    >
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Upload className="h-5 w-5 text-[#4318FF]" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-[#2B3674] truncate">
                          {file ? file.name : "Pilih File"}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {file
                            ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                            : "Format PDF, Maks 5MB"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full h-12 bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Kirim Pengajuan"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Motion.div>
    </div>
  );
};

export default Pengajuan;
