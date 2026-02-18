import { X, CheckCircle2, Download, Eye } from "lucide-react";
import { motion as Motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Syarat = ({
  children,
  syarat,
  title,
  handlerDownload,
  handlerPreview,
  showPreview,
  setShowPreview,
  url,
}) => {
  return (
    <Motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      <Card className="border-none shadow-xl shadow-shadow-500/10 rounded-[20px] bg-white border-gray-100 overflow-hidden">
        <CardHeader className="border-b border-gray-50 pb-6">
          <CardTitle className="text-xl font-bold text-[#2B3674]">
            Persyaratan {title}
          </CardTitle>
          <p className="text-sm text-gray-500 font-medium pt-1">
            Harap baca dengan seksama langkah-langkah di bawah ini
          </p>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <ul className="grid gap-4">
            {syarat.map((item, index) => (
              <li key={index} className="flex gap-4 items-start group">
                <div className="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-[#4318FF] group-hover:text-white transition-colors">
                  <span className="text-xs font-bold text-[#4318FF] group-hover:text-white">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#2B3674] leading-relaxed">
                  {item}
                </p>
              </li>
            ))}
          </ul>

          {children && <div className="pt-4">{children}</div>}

          {url && (
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50">
              <Button
                onClick={handlerDownload}
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 font-bold flex items-center gap-2 shadow-lg shadow-green-500/20"
              >
                <Download className="h-4 w-4" />
                Unduh Berkas
              </Button>

              <Button
                onClick={handlerPreview}
                variant="outline"
                className="rounded-xl px-6 font-bold flex items-center gap-2 border-gray-100 text-[#2B3674] hover:bg-gray-50 shadow-sm"
              >
                <Eye className="h-4 w-4" />
                {showPreview ? "Tutup Pratinjau" : "Lihat Berkas"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && url && (
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[30px] border-none shadow-2xl relative">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(false)}
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#2B3674] transition-all"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-1 h-full min-h-[500px]">
              <iframe
                src={url}
                title="Preview PDF"
                width="100%"
                height="600px"
                className="w-full h-[600px] border-none rounded-[25px]"
              ></iframe>
            </div>
          </Card>
        </Motion.div>
      )}
    </Motion.div>
  );
};

export default Syarat;
