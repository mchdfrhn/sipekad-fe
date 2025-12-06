import Underline from "./Underline";
import { Link } from "react-router";


const TableRiwayat = ({ historyRequest }) => {

  const propertyTable = [
    "antrian",
    "tanggal Pengajuan",
    "tipe",
    "Pesan",
    "status",
  ];
  return (
    <>
      <h1 className="text-xl font-semibold text-slate-800">
        Riwayat Pengajuan
      </h1>
      <Underline />
      <div className="flex items-center mb-6">
        <span className="inline-block size-3 bg-red-500 rounded-full mr-2"></span>
        <p>: ditolak</p>
        <span className="inline-block size-3 bg-green-700 rounded-full mx-2"></span>
        <p>: diterima</p>
        <span className="inline-block size-3 bg-yellow-500 rounded-full mx-2"></span>
        <p>: diproses</p>
      </div>
      <div className="rounded-lg bg-white overflow-hidden shadow-xl ">
        <div className="px-2 py-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {propertyTable.map((prop) => (
                  <th
                    key={prop}
                    className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell"
                  >
                    {prop}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyRequest.map((value, index) => (
                <tr
                  key={index}
                  className="flex flex-row items-center justify-between hover:shadow-md cursor-pointer transition-all transition-duration justify-between gap-2 md:table-row mb-4 md:mb-0 md:border-b-4 border-gray-600 md:border-none md:p-0"
                >
                  <td className="md:px-6 hidden py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/dashboard/${ value.id }`}>{value.queue}</Link>
                  </td>
                   <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/dashboard/${ value.id }`}>
                      {new Date(value.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                      })}
                    </Link>
                  </td>
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell"
                  >
                    <Link to={`/dashboard/${ value.id }`}>
                      {value.type}
                    </Link>
                  </td>
                  <td className="md:px-6 hidden py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell"
                  >
                    <Link to={`/dashboard/${ value.id }`}>
                     {value.message}
                    </Link>
                  </td>
                  <td className="md:px-6 uppercase py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell"
                  >
                    <Link to={`/dashboard/${ value.id }`}>
                      <span className={`px-2 py-1 rounded-md ${ value.status === "completed" && "bg-green-300 text-green-800" } ${ value.status === "pending" && "bg-yellow-400 text-yellow-800" } ${ value.status === "canceled" && "bg-red-400 text-red-800" }`}>
                        {value.status}
                      </span>
                  
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
};

export default TableRiwayat;
