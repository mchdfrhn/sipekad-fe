import Underline from "../ui/Underline";
import { getResponseById } from "../../utils/api/response";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, X } from "lucide-react";
import IframeRequest from "../admin/request/IframeRequest";

const RequestDetailUser = () => {
  const [responses, setResponse] = useState([]);
  const [showFile, setShowFile] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    const getResponse = async () => {
      const token = localStorage.getItem("tokenKey");
      await getResponseById(id, token, setResponse);
    };

    getResponse();
  }, [id]);
  const response = responses[0];
  return (
    <div className="pt-14">
      {showFile && (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black/20"></div>
      )}

      {showFile && (
        <div className="w-sm md:w-md xl:w-4xl p-4 bg-white rounded-md shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setShowFile(!showFile)}
            className="cursor-pointer"
          >
            <X />
          </button>
          <IframeRequest url={response?.url} />
        </div>
      )}
      <div className="mb-4 my-2">
        <Link to={"/dashboard"} className="flex items-center gap-2">
          <ArrowLeft />{" "}
          <span className="text-xl font-semibold text-gray-800">Dashboard</span>{" "}
        </Link>
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
                <span className="flex justify-start">
                  <p
                    className={`px-2 py-1 rounded-md mt-4 ${
                      response?.status === "completed" &&
                      "bg-green-600/50 text-green-800"
                    }  ${
                      response?.status === "canceled" &&
                      "bg-red-600/50 text-red-800"
                    } ${
                      response?.status === "pending" &&
                      "bg-yellow-600/50 text-yellow-800"
                    }`}
                  >
                    {response?.status}
                  </p>
                </span>
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
                    onClick={() => setShowFile(!showFile)}
                    className="bg-yellow-500 rounded-md font-semibold cursor-pointer px-4 border-2 border-transparent hover:bg-transparent hover:border-gray-800 transition-duration py-1 hover"
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
