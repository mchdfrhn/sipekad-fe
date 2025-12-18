import Underline from "../ui/Underline";
import { getResponseById } from "../../utils/api/response";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
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
        <Link to={"/dashboard"} className="flex items-center gap-2">
          <ArrowLeft />{" "}
          <span className="text-xl font-semibold text-gray-800">Dashboard</span>{" "}
        </Link>
      </div>
      <div className="bg-white w-full shadow-md rounded-md px-4 py-2">
        <h1 className="text-2xl font-bold text-gray-800">Response</h1>
        <Underline />
        <table className="w-full">
          <thead>
            <tr className="">
              <th className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell" >No</th>
              <th className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell">Message</th>
              <th className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell">Tanggal</th>
              <th className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {response.length !== 0
              ? response.map((res, i) => {
                  return (
                    <tr>
                      <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">{i + 1}</td>
                      <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">{res.message}</td>
                      <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                        {new Date(res.updated_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                        <span className={`px-2 py-2 rounded-md ${
                      res.status === "completed" &&
                      "bg-green-300 text-green-800"
                    } ${
                      res.status === "pending" &&
                      "bg-yellow-400 text-yellow-800"
                    } ${
                      res.status === "canceled" && "bg-red-400 text-red-800"
                    } `}>{ res.status }</span>
                      </td>
                    </tr>
                  );
                })
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestDetailUser;
