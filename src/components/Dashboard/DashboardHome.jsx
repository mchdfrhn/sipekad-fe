import Underline from "../ui/Underline";
import TableRiwayat from "../ui/TableRiwayat";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CardDashboard from "../ui/CardDashboard";
import ButtonPagination from "../ui/ButtonPagination";
import { getRequest } from "../../utils/api/request";

const DashboardHome = () => {
  const [historRequest, setHistoryRequest] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const changePageHandler = async (p) => {
    await getRequest(p);
  };
  useEffect(() => {
    const getRequestHandler = async () => {
      const user = localStorage.getItem("user");
      const userId = JSON.parse(user).id;
      const result = await getRequest(userId);
      if (result.status === "success") {
        console.log(result);
        setHistoryRequest(result.data);
        setTotalPage(result.totalPage);
        setPage(result.page);
      }
    };

    getRequestHandler();
  }, []);

  const totalRequest = historRequest.length;
  const successRequest = historRequest.filter(
    (req) => req.status === "completed"
  ).length;
  const procesingRequest = historRequest.filter(
    (req) => req.status === "pending"
  ).length;
  const rejectedRequest = historRequest.filter(
    (req) => req.status === "canceled"
  ).length;

  return (
    <div className="xl:pl-[28%] py-20 px-8 bg-slate-100 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <Link
          to={"/dashboard/request"}
          className="p-2 font-semibold border-2 border-transparent hover:border-slate-800 hover:bg-transparent transition-colors transition-duration flex items-center bg-yellow-500 rounded-md gap-2 text-sm"
        >
          {" "}
          <Plus size={20} /> Tambah Pengajuan
        </Link>
      </div>
      <Underline />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-8 md:gap-4">
        <CardDashboard title={"Total pengajuan"} value={totalRequest} />
        <CardDashboard
          title={"Pengajuan yang diterima"}
          value={successRequest}
        />
        <CardDashboard
          title={"Pengajuan yang diproses"}
          value={procesingRequest}
        />
        <CardDashboard
          title={"Pengajuan yang ditolak"}
          value={rejectedRequest}
        />
      </div>
      <TableRiwayat historyRequest={historRequest} />
      <ButtonPagination
        page={page}
        handlePageChange={changePageHandler}
        totalPage={totalPage}
      />
    </div>
  );
};

export default DashboardHome;
