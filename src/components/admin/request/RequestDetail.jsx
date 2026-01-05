import { useState, useEffect } from "react";
import { getRequestDetail } from "../../../utils/api/request";
import { useParams, Link } from "react-router";
import { addResponseHandler } from "../../../utils/action";
import { Loader2, ArrowLeft, Link as LinkIcon } from "lucide-react";
import TableResponse from "./TableResponse";
import IframeRequest from "./IframeRequest";
import SuccessModal from "../../ui/SuccessModal";

const RequestDetail = () => {
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);
  const [requestDetail, setRequestDetail] = useState(null);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);
  const [displayIframe, setDisplayIframe] = useState(false);
  const [file, setFile] = useState(null);
  const [isDisplay, setIsDisplay] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getRequestDetail(id, setRequestDetail, setResponses);
  }, [id]);

  const propertyResponse = ["No", "message", "created at", "file"];

  const onOkHandler = async() => {
    setIsDisplay(!isDisplay);
    await getRequestDetail(id, setRequestDetail, setResponses);
  }

  const onAddResponseHandler = async(e) => {
    e.preventDefault();
    setLoading(true);
    addResponseHandler({ id, message, isComplete: isActive, file }, setIsDisplay, isDisplay, setLoading)
  }
  return (
    <>
    {
      isDisplay && <SuccessModal onOkHandler={onOkHandler} text={"Berhasil menambahkan response"}  />
    } 
      <div className="flex justify-start my-8">
        <Link to={"/admin/pengajuan"} className="block">
          <ArrowLeft />
        </Link>
      </div>
      <div className={`mt-8 grid grid-cols-1 ${ requestDetail?.status === "pending" && "md:grid-cols-2" }  gap-4`}>
        <div className="bg-white px-4 py-2 rounded-md shadow-md">
          <div className="">
            <p className="text-2xl font-bold">Nama Lengkap:</p>
            <Link
              to={`/admin/user/${requestDetail?.user_id}`}
              className="flex items-center gap-2"
            >
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

          <div className="flex justify-start flex-col items-start">
            <p className="text-2xl font-bold">Status:</p>
            <div className="flex items-center gap-2">
              <p>{ requestDetail?.status }</p>
              <span className={`block size-2 ${ requestDetail?.status === "pending" && "bg-yellow-500" } ${ requestDetail?.status === "canceled" && "bg-red-500" } ${ requestDetail?.status === "completed" && "bg-green-500" } rounded-full`}></span>
            </div>
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
                className="mt-4 border border-transparent w-full py-1 rounded-md bg-blue-500 text-white cursor-pointer hover:text-gray-800 hover:bg-transparent hover:border-gray-800 transition-color transition-duration"
              >
                Tampilkan File
              </button>
            )}
          </div>
        </div>
        {displayIframe && (
          <div onClick={ () => setDisplayIframe(!displayIframe) } className="fixed inset-0 w-screen h-screen z-99 bg-gray-500/50 flex justify-center items-center">
            <IframeRequest url={requestDetail?.url} className={"w-[40rem]"} />
          </div>
        )}
        {requestDetail?.status === "pending" && (
          <div className="bg-white px-4 py-6 shadow-md overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">Response</h2>
            <form
              onSubmit={ (e) => onAddResponseHandler(e) }
              className="flex flex-col justify-between w-full gap-4"
              action=""
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="message"
                className="border border-gray-500 rounded-md px-4 py-1 outline-none"
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
              <button className={`flex justify-center text-white py-1 rounded-md border border-transparent hover:border-blue-500 ${ isLoading ? "bg-blue-500/50 cursor-disable" : "bg-blue-500" } hover:text-blue-500 hover:bg-transparent cursor-pointer transition-duration`}>
                {
                  isLoading ? <div className="animate-spin"><Loader2 /></div> : "Tambah response"
                }
              </button>
            </form>
          </div>
        )}
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
      </div>
    </>
  );
};

export default RequestDetail;
