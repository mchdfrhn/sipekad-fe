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
} from "lucide-react";
import StatsCard from "../StatsCard";
import { filterStatusForUserDetail } from "../../../utils/action";
import { getSummeryDataByUserId } from "../../../utils/api/dashboardValue";
import UpdateUserForm from "./UpdateUserForm";

const UserDetail = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [request, setRequest] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [summery, setSummery] = useState([]);
  const { id: userId } = useParams();
  const [showForm, setShowForm] = useState(false);

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
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-3 mr-2 bg-[#4318FF] text-white rounded-full text-sm shadow-[0_4px_14px_0_rgba(67,24,255,0.39)] hover:shadow-[0_6px_20px_rgba(67,24,255,0.23)] hover:scale-[1.02] transition-all duration-300 font-bold"
        >
          <Pen className="h-4 w-4" />
          <span>Update User</span>
        </button>
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
                Email Address
              </p>
              <p className="text-sm font-semibold text-[#2B3674]">
                {userDetail?.email || "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">
                Phone Number
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

export default UserDetail;
