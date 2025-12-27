import { getUserDetail } from "../../../utils/api/user";
import { getRequest } from "../../../utils/api/request";
import { useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { TablePengajuan } from "../request/Requets";
import { ArrowLeft, ArrowRight, Pen } from "lucide-react";
import CardDashboardUser from "./CardDashboardUser";
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
      userId
    );
  };
  return (
    <>
      <UpdateUserForm setShowForm={setShowForm} userDetail={userDetail} shwoForm={showForm} />
      <div className="flex justify-between items-center">
        <Link to={"/admin/user"} className="my-8 block">
          <ArrowLeft />
        </Link>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-2 py-1 bg-yellow-500 rounded-md shadow-md cursor-pointer border border-transparent hover:border-gray-700 hover:bg-transparent transition-duration">
          <div className="size-4">
            <Pen className="w-full h-full" />
          </div>
          <span>Update User</span>
        </button>
      </div>
      <div className="mt-8 bg-white rounded-md shadow-md flex flex-col md:flex-row gap-4 px-2 py-6">
        <div className="flex items-center gap-4">
          <div className="size-30 rounded-full overflow-hidden">
            {userDetail?.url_photo ? (
              <img
                src={userDetail?.url_photo}
                alt=""
                className="w-full h-full object-center object-cover"
              />
            ) : (
              <img
                src={"/avatar.png"}
                alt=""
                className="w-full h-full object-center object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{userDetail?.username}</h1>
            <p>{userDetail?.nim}</p>
            <div className="mt-2 text-gray-500">
              <p className="text-sm">{userDetail?.email}</p>
              <p className="text-sm">{userDetail?.phone}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <CardDashboardUser
            title={summery[0]?.label}
            value={summery[0]?.value}
            className={
              "bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500"
            }
          />
          <CardDashboardUser
            title={summery[3]?.label}
            value={summery[3]?.value}
            className={
              "bg-gradient-to-r from-green-600 via-green-500 to-emerald-400"
            }
          />
          <CardDashboardUser
            title={summery[1]?.label}
            value={summery[1]?.value}
            className={
              "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300"
            }
          />
          <CardDashboardUser
            title={summery[2]?.label}
            value={summery[2]?.value}
            className={"bg-gradient-to-r from-rose-600 via-red-500 to-red-400"}
          />
        </div>
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
