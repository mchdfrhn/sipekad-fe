import { ArrowLeft, ArrowRight, Send,Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllRequestForAdmin } from "../../../utils/api/request";
import { Link } from "react-router";
import FilterControl from "../../ui/SortControl";
import { filterStatus } from "../../../utils/action";

const RequestAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1); // curent page
  const [totalPage, setTotalPage] = useState(1);

  const getRequests = async (page = 1) => {
    const requests = await getAllRequestForAdmin(page);
    if (requests.status === "success") {
      setRequests(requests.data);
      setPage(requests.page);
      setTotalPage(requests.totalPage);
    }
  };

  const handlePageChange = async (p) => {
    await getRequests(p);
  };

  useEffect(() => {
    getRequests(1);
  }, []);

  const onChangeHandler = async (e) => {
    const status = e.target.value;
    let getAllData = status === "default";
    await filterStatus(status, setRequests, setPage, setTotalPage, getAllData);
  };
  return (
    <>
      <TablePengajuan requests={requests} onChangeHandler={onChangeHandler} />
      <div className="flex gap-4 justify-end mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          className="size-8 rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer disabled:text-gray-400"
          disabled={page === 1}
        >
          <ArrowLeft />
        </button>
        {[...Array(totalPage)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pageNumber)}
                className="size-8 flex justify-center items-center rounded-full bg-white shadow-md"
              >
                {pageNumber}
              </button>
            </div>
          );
        })}
        <button
          onClick={() => handlePageChange(page + 1)}
          className="size-8 rounded-full flex justify-center items-center bg-white shadow-md cursor-pointer disabled:text-gray-400"
          disabled={page === totalPage}
        >
          <ArrowRight />
        </button>
      </div>
    </>
  );
};

export const TablePengajuan = ({
  requests,
  dontDisplayLink,
  dontDisplayUsername,
  onChangeHandler,
}) => {
  const dataKey = [
    "No",
    "Antrian",
    "nama",
    "Type",
    "Created At",
    "status",
    "action",
  ];
  return (
    <>
      {!dontDisplayLink && (
        <Link to={"/admin"} className="my-8 block">
          <ArrowLeft />
        </Link>
      )}
      <div className="px-4 py-6 bg-white rounded-md shadow-md w-full">
        <h1 className="font-semibold md:text-xl uppercase">Pengajuan</h1>
        <span className="inline-block w-8 h-1 bg-gray-800"></span>
        <FilterControl onChangeHandler={onChangeHandler} />
        <div className="overflow-x-auto py-8">
          <table className="w-full">
            <thead>
              <tr>
                {dontDisplayUsername
                  ? dataKey.map(
                      (data) =>
                        data !== "nama" && (
                          <th
                            key={data}
                            className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell"
                          >
                            {data}
                          </th>
                        )
                    )
                  : dataKey.map((data) => (
                      <th
                        key={data}
                        className="px-3 md:px-6 py-2 md:py-4 text-left text-sm font-semibold uppercase tracking-wide hidden md:table-cell"
                      >
                        {data}
                      </th>
                    ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((value, index) => (
                <tr
                  key={index}
                  className="flex flex-row hover:shadow-md cursor-pointer transition-all transition-duration justify-between gap-4 items-center md:table-row mb-4 md:mb-0 md:border-b-4 border-gray-600 md:border-none md:p-0"
                >
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/pengajuan/${value.id}`}>{index + 1}</Link>
                  </td>
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/pengajuan/${value.id}`}>
                      {value.queue}
                    </Link>
                  </td>
                  {!dontDisplayUsername && (
                    <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                      <Link to={`/admin/pengajuan/${value.id}`}>
                        {value.full_name}
                      </Link>
                    </td>
                  )}

                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/pengajuan/${value.id}`}>
                      {value.type}
                    </Link>
                  </td>
                  <td className="md:px-6 hidden py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/pengajuan/${value.id}`}>
                      {new Date(value.updated_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Link>
                  </td>
                  <td className="md:px-6 uppercase py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <span
                      className={`px-2 py-1 rounded-md ${
                        value.status === "completed" &&
                        "bg-green-300 text-green-800"
                      } ${
                        value.status === "pending" &&
                        "bg-yellow-400 text-yellow-800"
                      } ${
                        value.status === "canceled" && "bg-red-400 text-red-800"
                      }`}
                    >
                      {value.status}
                    </span>
                  </td>
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/pengajuan/${ value.id }`} className={`block size-8 md:size-10 ${ value.status !== "pending" ? "bg-blue-500/50":"bg-green-500/40" } rounded-md flex justify-center items-center`}>
                      {value.status !== "pending" 
                        ? <Eye className="text-blue-800" />
                        : <Send className="text-green-800" />}
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

export default RequestAdmin;
