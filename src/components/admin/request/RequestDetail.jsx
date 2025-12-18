import { useState, useEffect } from "react";
import { getRequestDetail } from "../../../utils/api/request";
import { useParams, Link } from "react-router";
import { addResponseHandler } from "../../../utils/action";
import { useNavigate } from "react-router";
import { X, ArrowLeft, Link as LinkIcon } from "lucide-react";
import TableResponse from "./TableResponse";
import IframeRequest from "./IframeRequest";

const RequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);
  const [requestDetail, setRequestDetail] = useState(null);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [displayIframe, setDisplayIframe] = useState(false);
  const [file, setFile] = useState(null);
  useEffect(() => {
    getRequestDetail(id, setRequestDetail, setResponses);
  }, [id]);
  const propertyResponse = ["No", "message", "created at"];
  return (
    <>
      <div className={`bg-black/10 w-screen h-[100vh] fixed top-0 ${ !displayIframe && "hidden" }`}></div>
      <div className="mt-8">
        <Link to={"/admin/pengajuan"} className=""><ArrowLeft /></Link>
        <div className="mb-4 mt-8 max-h-md:max-h-[20rem] grid bg-white shadow-md grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 p-4 rounded-md">
          <div className="">
            <p className="text-2xl font-bold">Nama Lengkap:</p>
            <Link to={`/admin/user/${ requestDetail?.user_id }`} className="flex items-center gap-2">
              <p>{requestDetail?.full_name}</p> <LinkIcon size={15} />
            </Link>
          </div>
          <div>
            <p className="text-2xl font-bold">Type:</p>
            <p>{requestDetail?.type}</p>
          </div>
          <div>
            <p className="text-2xl font-bold">NIM:</p>
            <p className="">{requestDetail?.nim}</p>
          </div>

          <div className="">
            <p className="text-2xl font-bold">Status:</p>
            <p>{requestDetail?.status}</p>
          </div>
          <div className="">
            <p className="text-2xl font-bold">Message:</p>
            <p>"{requestDetail?.message}"</p>
          </div>
          <div>
            <p className="text-2xl font-bold">File:</p>
            {requestDetail?.url && (
              <button
                onClick={() => setDisplayIframe(!displayIframe)}
                className="mt-4 border border-transparent w-full py-1 rounded-md bg-yellow-400 cursor-pointer hover:text-gray-800 hover:bg-transparent hover:border-gray-800 transition-color transition-duration"
              >
                Tampilkan File
              </button>
            )}
          </div>
        </div>
        {displayIframe && (
          <div className="p-10 bg-white shadow-md rounded-md mb-4 w-sm xl:w-4xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={() => setDisplayIframe(!displayIframe)} className="cursor-pointer"><X /></button>
            <IframeRequest url={requestDetail?.url} />
          </div>
        )}
        <div className="bg-white px-4 py-6 shadow-md overflow-y-auto">
          <h2 className="mb-4 text-xl font-bold">Response</h2>
          <form
            onSubmit={(e) =>
              addResponseHandler(
                e,
                { id, message, isComplete: isActive, file },
                navigate
              )
            }
            className="flex flex-col justify-between w-full gap-4"
            action=""
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="message"
              className="px-4 py-2 bg-gray-200 rounded-md shadow-md focus:outline-1"
            />
            <div className="">
              <p className="font-semibold text-xl mt-2">Status</p>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    checked={isActive === true}
                    onChange={() => setIsActive(true)}
                  />
                  <span>Completed</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    checked={isActive === false}
                    onChange={() => setIsActive(false)}
                  />
                  <span>Canceled</span>
                </label>
              </div>
              <div className="mt-4">
                <label className="text-xl font-semibold" htmlFor="file">
                  Upload File
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="input-pengajuan mt-2"
                />
              </div>
            </div>
            <button
              disabled={
                requestDetail?.status === "completed" ||
                requestDetail?.status === "canceled"
              }
              type="submit"
              className="md:px-4 disabled:bg-yellow-500/50 disabled:cursor-not-allowed md:py-2 bg-yellow-500 rounded-md font-semibold border-3 cursor-pointer transition-color transition-duration border-transparent hover:bg-transparent hover:border-gray-800"
            >
              Add Response
            </button>
          </form>
        </div>
      </div>
      <div className="bg-white rounded-md shadow-md px-4 mt-4 md:px-6 md:py-4">
        <h1 className="mb-2 font-semibold text-xl">Response</h1>
        {responses.length === 0 ? (
          <>
            <h1>Response Belum Ada</h1>
          </>
        ) : (
          <TableResponse response={responses} dataKey={propertyResponse} />
        )}
      </div>
    </>
  );
};

export default RequestDetail;
