import Underline from "../ui/Underline";
import { getResponseById } from "../../utils/api/response";
import { useState, useEffect } from "react";
import { useParams , Link} from "react-router";
import { ArrowLeft } from "lucide-react";

const RequestDetailUser = () => {
  const [response, setResponse] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const getResponse = async () => {
      const token = localStorage.getItem("tokenKey");
      await getResponseById(id, token, setResponse);
    };

    getResponse();
  }, [id]);
  return (
    <div className="xl:pl-[28%] py-20 px-8 bg-slate-100 min-h-screen">
      <div className="mb-4 my-2">
        <Link to={"/dashboard"} className="flex items-center gap-2"><ArrowLeft /> <span className="text-xl font-semibold text-gray-800">Dashboard</span> </Link>
      </div>
      <div className="bg-white w-full shadow-md rounded-md px-4 py-2">
        <h1 className="text-2xl font-bold text-gray-800">Response</h1>
        <Underline />
        <div className="flex justify-between uppercase font-semibold text-gray-800 border-b pb-2">
          <p>No</p>
          <p>Message</p>
          <p>Tanggal</p>
          <p>status</p>
        </div>
        <div>
          {
            response.length !== 0 ? response.map((res, i) => {
            return (
              <div className="flex justify-between text-gray-800 items-center py-2">
                <p>{i + 1}</p>
                <p>{res.message}</p>
                <p>
                  {new Date(res.updated_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
                <p
                  className={`px-2 py- rounded-md ${
                    res.status === "completed" && "bg-green-300 text-green-800"
                  } ${
                    res.status === "pending" && "bg-yellow-400 text-yellow-800"
                  } ${res.status === "canceled" && "bg-red-400 text-red-800"} `}
                >
                  {res.status}
                </p>
              </div>
            );
          }) : <div className="mt-4 mb-2 text-center"><h1 className="text-xl text-gray-400">Admin Belum memberikan response {response.length}</h1></div>
          }
        </div>
      </div>
    </div>
  );
};

export default RequestDetailUser;
