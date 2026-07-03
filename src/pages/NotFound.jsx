import { Link } from "react-router";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-indigo-50 flex items-center justify-center">
        <FileQuestion className="h-12 w-12 text-[#4318FF]" />
      </div>
      <h1 className="text-6xl font-extrabold text-[#2B3674] mb-2">404</h1>
      <p className="text-lg font-bold text-gray-500 mb-1">Halaman Tidak Ditemukan</p>
      <p className="text-sm text-gray-400 mb-8">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Button asChild className="bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-xl px-6">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Beranda
        </Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
