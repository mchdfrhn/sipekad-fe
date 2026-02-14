import IframeRequest from "./IframeRequest";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, Eye } from "lucide-react";

const TableResponse = ({ dataKey, response }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  return (
    <>
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {dataKey.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {response.map((value, index) => (
              <tr
                key={index}
                className={`border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-[#2B3674]">
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 leading-relaxed min-w-[200px]">
                    {value.message}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-[#2B3674]">
                    {new Date(value.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {value.url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFileUrl(value.url)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-100 h-8 text-xs"
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Lihat File
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      Tidak ada file
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Global Modal for this table */}
      {selectedFileUrl && (
        <div
          onClick={() => setSelectedFileUrl(null)}
          className="fixed inset-0 w-screen h-screen bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b flex justify-between items-center bg-white z-10">
              <h3 className="font-bold text-lg text-gray-800">Preview File</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFileUrl(null)}
              >
                Tutup
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <IframeRequest
                url={selectedFileUrl}
                className="w-full h-full min-h-[500px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableResponse;
