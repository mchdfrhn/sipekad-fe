import Underline from "../ui/Underline";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, X } from "lucide-react";
import IframeRequest from "../admin/request/IframeRequest";
import { getRequestDetail } from "../../utils/api/request";

const RequestDetailUser = () => {
  const [responses, setResponse] = useState([]);
  const [data, setData] = useState([]);
  const [showFrameResponse, setShowFrameResponse] = useState(false);
  const [showFrameRequest, setShowFrameRequest] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const getRequestDetailForUser = async () => {
      await getRequestDetail(id, setData, setResponse);
    };
    getRequestDetailForUser();
  }, [id]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = data?.url;
    link.download = `${data?.full_name}-${data?.queue}.pdf`;
    link.click();
  };

  const response = responses[0];
  return (
    <div className="p-layout">
      {showFrameResponse && (
        <div
          onClick={() => setShowFrameResponse(!showFrameResponse)}
          className="fixed inset-0 bg-gray-500/50 w-screen h-screen flex justify-center items-center z-99"
        >
          <IframeRequest
            url={response?.url}
            className={"w-[20rem] md:w-120 xl:w-160"}
          />
        </div>
      )}
      {showFrameRequest && (
        <div
          onClick={() => setShowFrameRequest(!showFrameRequest)}
          className="fixed inset-0 bg-gray-500/50 w-screen h-screen flex justify-center items-center z-99"
        >
          <IframeRequest
            url={data?.url}
            className={"w-[20rem] md:w-120 xl:w-160"}
          />
        </div>
      )}
      <div className="mb-4 my-2">
        <Link to={"/dashboard"} className="flex items-center gap-2">
          <ArrowLeft />{" "}
          <span className="text-xl font-semibold text-gray-800">
            Dashboard
          </span>{" "}
        </Link>
      </div>
      <div className="bg-white w-full shadow-md rounded-md px-4 py-6 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Pengajuan</h1>
        <Underline />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-rows-2">
          <div>
            <p className="text-xl font-bold">Message</p>
            <p>"{data?.message}"</p>
          </div>
          <div>
            <p className="text-xl font-bold">Tanggal</p>
            <p>
              {new Date(data?.updated_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
          <div className="md:col-span-3 mt-4">
            {data?.url ? (
              <>
                <button
                  onClick={() => setShowFrameRequest(!showFrameRequest)}
                  className="bg-blue-500 px-2 text-xs md:text-[16px] py-1 rounded-md text-white cursor-pointer border hover:text-blue-500 hover:bg-transparent transition-color duration-300 ease-in-out"
                >
                  Lihat Berkas
                </button>
                <button
                  onClick={handleDownload}
                  className="ml-2 bg-blue-500 px-2 text-xs md:text-[16px] py-1 rounded-md text-white cursor-pointer border hover:text-blue-500 hover:bg-transparent transition-color duration-300 ease-in-out"
                >
                  Download Berkas
                </button>
              </>
            ) : (
              <h1>Tidak ada file yang dilampirkan</h1>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white w-full shadow-md rounded-md px-4 py-2">
        <h1 className="text-2xl font-bold text-gray-800">Response</h1>
        <Underline />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-rows-2">
          {responses?.length < 1 ? (
            <h1>Belum ada response</h1>
          ) : (
            <>
              <div>
                <p className="text-xl font-bold">Status</p>
                <div className="flex justify-start items-center gap-2">
                  <p className="">{response?.status}</p>{" "}
                  <span
                    className={`block size-2 rounded-md ${response?.status === "completed" && "bg-green-500"} ${response?.status === "canceled" && "bg-red-500"}`}
                  ></span>
                </div>
              </div>
              <div>
                <p className="text-xl font-bold">Message</p>
                <p>"{response?.message}"</p>
              </div>
              <div>
                <p className="text-xl font-bold">Tanggal</p>
                <p>
                  {new Date(response?.updated_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </div>
              <div className="md:col-span-3 mt-4">
                {response?.url ? (
                  <button
                    onClick={() => setShowFrameResponse(!showFrameResponse)}
                    className="bg-blue-500 px-2 text-xs md:text-[16px] py-1 rounded-md text-white cursor-pointer border hover:text-blue-500 hover:bg-transparent transition-color duration-300 ease-in-out"
                  >
                    Lihat Berkas
                  </button>
                ) : (
                  <h1>Tidak ada file yang dilampirkan</h1>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailUser;
