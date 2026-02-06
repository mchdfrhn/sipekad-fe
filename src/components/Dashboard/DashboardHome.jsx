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
    (req) => req.status === "completed",
  ).length;
  const procesingRequest = historRequest.filter(
    (req) => req.status === "pending",
  ).length;
  const rejectedRequest = historRequest.filter(
    (req) => req.status === "canceled",
  ).length;

  return (
    <div className="w-full">
      <HeaderDashboard />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to={"/dashboard/request"}
          className="block flex items-center md:gap-2 text-sm bg-blue-500 text-white px-4 py-2 border rounded-md font-semibold hover:bg-transparent hover:border-blue-500 hover:text-blue-500 transition-color duration-300 ease-in-out"
        >
          <Plus size={20} />{" "}
          <p className="text-xs md:text-sm">Tambah Pengajuan</p>
        </Link>
      </div>
      <Underline />
      <div className="grid grid-cols-1 grid-cols-2 xl:grid-cols-4 gap-2 mb-8 md:gap-4">
        <CardDashboardUser
          className={"bg-total-pengajuan shadow-md"}
          title={"Total pengajuan"}
          value={totalRequest}
          index={4}
        />
        <CardDashboardUser
          title={"Pengajuan yang diterima"}
          value={successRequest}
          className={"bg-pengajuan-berhasil shadow-md"}
          index={5}
        />
        <CardDashboardUser
          className={"bg-pengajuan-proses shadow-md"}
          title={"Pengajuan yang diproses"}
          value={procesingRequest}
          index={6}
        />
        <CardDashboardUser
          className={"bg-pengajuan-ditolak shadow-md"}
          title={"Pengajuan yang ditolak"}
          value={rejectedRequest}
          index={7}
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
