import Underline from "../ui/Underline";
import TableRiwayat from "../ui/TableRiwayat";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ButtonPagination from "../ui/ButtonPagination";
import { getRequest } from "../../utils/api/request";
import CardDashboardUser from "../admin/user/CardDashboardUser";
import HeaderDashboard from "../Header/HeaderDashboard";

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
    <div className="py-12">
      <HeaderDashboard />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to={"/dashboard/request"}
          className="block flex items-center gap-2 px-2 py-1 md:px-4 md:py-2 bg-yellow-500 rounded-md shadow-md cursor-pointer border border-transparent hover:bg-transparent hover:border-gray-800 transition-duration"
        >
          <Plus size={20} /> <p className="text-xs md:text-sm">Tambah Pengajuan</p>
        </Link>
      </div>
      <Underline />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-8 md:gap-4">
        <CardDashboardUser
          className={"bg-total-pengajuan shadow-md"}
          title={"Total pengajuan"}
          value={totalRequest}
        />
        <CardDashboardUser
          title={"Pengajuan yang diterima"}
          value={successRequest}
          className={"bg-pengajuan-berhasil shadow-md"}
        />
        <CardDashboardUser
          className={"bg-pengajuan-proses shadow-md"}
          title={"Pengajuan yang diproses"}
          value={procesingRequest}
        />
        <CardDashboardUser
          className={"bg-pengajuan-ditolak shadow-md"}
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
