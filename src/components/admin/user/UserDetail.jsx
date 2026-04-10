import { getUserDetail } from "../../../utils/api/user";
import { getRequest } from "../../../utils/api/request";
import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { TablePengajuan } from "../request/Requests";
import {
  ArrowLeft,
  ArrowRight,
  Pen,
  LayoutDashboard,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import StatsCard from "../StatsCard";
import { filterStatusForUserDetail, resetPasswordAction } from "../../../utils/action";
import { getSummeryDataByUserId } from "../../../utils/api/dashboardValue";
import UpdateUserForm from "./UpdateUserForm";
import ButtonPagination from "../../ui/ButtonPagination";
import { useToast } from "@/utils/hooks/useToast";
import ConfirmDialog from "../../ui/ConfirmDialog";

const UserDetail = () => {
  const { showToast } = useToast();
  const [userDetail, setUserDetail] = useState(null);
  const [request, setRequest] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [summery, setSummery] = useState([]);
  const { id: userId } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [alertReset, setAlertReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const getDetailUser = async (userId, p = 1) => {
    const token = localStorage.getItem("tokenKey");
    const result = await getUserDetail(token, userId);
    if (result.status === "success") {
      setUserDetail(result.data);
    }

    const requestResult = await getRequest(userId, p);
    if (requestResult.status === "success") {
      setRequest(requestResult.data);
      setPage(requestResult.page);
      setTotalPage(requestResult.totalPage);
    }
  };

  useEffect(() => {
    getDetailUser(userId);
    getSummeryDataByUserId(setSummery, userId);
  }, [userId]);
  const handlePageChange = async (p) => {
    await getDetailUser(userId, p);
  };
  const onChangeHandler = async (e) => {
    const status = e.target.value;
    let getAllData = status === "default";
    await filterStatusForUserDetail(
      status,
      setRequest,
      setPage,
      setTotalPage,
      getAllData,
      userId,
    );
  };
  const confirmReset = async () => {
    setIsResetting(true);
    const result = await resetPasswordAction(userId);
    if (result.status === "success") {
      showToast(result.message, "success");
    } else {
      showToast(result.message || "Gagal mereset password", "error");
    }
    setIsResetting(false);
    setAlertReset(false);
  };

  return (
    <>
      <UpdateUserForm
        setShowForm={setShowForm}
        userDetail={userDetail}
        shwoForm={showForm}
      />
      <div className="flex justify-between items-center mb-6">
        <Link
          to={"/admin/user"}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center text-[#2B3674]"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAlertReset(true)}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-3 bg-white text-[#2B3674] border border-gray-100 rounded-full text-sm shadow-sm hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 font-bold disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
            <span>Reset Password</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-3 mr-2 bg-[#4318FF] text-white rounded-full text-sm shadow-[0_4px_14px_0_rgba(67,24,255,0.39)] hover:shadow-[0_6px_20px_rgba(67,24,255,0.23)] hover:scale-[1.02] transition-all duration-300 font-bold"
          >
            <Pen className="h-4 w-4" />
            <span>Perbarui Pengguna</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden mb-6 p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm">
              {userDetail?.url_photo ? (
                <img
                  src={userDetail?.url_photo}
                  alt={userDetail?.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F4F7FE] flex items-center justify-center">
                  <Users className="h-12 w-12 text-[#4318FF]" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 w-full">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                Nama Lengkap
              </p>
              <h1 className="text-xl font-bold text-[#2B3674]">
                {userDetail?.username}
              </h1>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                Program Studi
              </p>
              <p className="text-sm font-semibold text-[#2B3674]">
                {userDetail?.prodi || "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                NIM/ID
              </p>
              <p className="text-sm font-semibold text-[#2B3674]">
                {userDetail?.nim || "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                Alamat Email
              </p>
              <p className="text-sm font-semibold text-[#2B3674]">
                {userDetail?.email || "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                Nomor Telepon
              </p>
              <p className="text-sm font-semibold text-[#2B3674]">
                {userDetail?.phone || "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                NIK
              </p>
              <p className="text-sm font-semibold text-[#2B3674]">
                {userDetail?.nik || "Belum dimasukan"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          variant="premium"
          title={summery[0]?.label}
          value={summery[0]?.value}
          icon={LayoutDashboard}
        />
        <StatsCard
          variant="orange"
          title={summery[1]?.label}
          value={summery[1]?.value}
          icon={Clock}
        />
        <StatsCard
          variant="green"
          title={summery[3]?.label}
          value={summery[3]?.value}
          icon={CheckCircle}
        />
        <StatsCard
          variant="red"
          title={summery[2]?.label}
          value={summery[2]?.value}
          icon={XCircle}
        />
      </div>
      <div className="my-10">
        <TablePengajuan
          requests={request}
          dontDisplayLink={true}
          dontDisplayUsername={true}
          onChangeHandler={onChangeHandler}
        />
      </div>
      <ButtonPagination
        page={page}
        totalPage={totalPage}
        handlePageChange={handlePageChange}
      />
      <ConfirmDialog
        isOpen={alertReset}
        onClose={() => setAlertReset(false)}
        onConfirm={confirmReset}
        title="Reset Password"
        description="Apakah Anda yakin ingin mereset password pengguna ini? Password akan dikembalikan ke NIK user."
        confirmText="Reset Password"
        variant="warning"
      />
    </>
  );
};


export default UserDetail;
