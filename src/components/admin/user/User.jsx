import {
  Trash,
  ArrowLeft,
  ArrowRight,
  X,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllUserForAdmin } from "../../../utils/api/user";
import { Link } from "react-router";
import AddUserForm from "./AddUserForm";
import { deleteUserForAdmin } from "../../../utils/action";

const User = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);

  const handlePageChange = async (p) => {
    const users = await getAllUserForAdmin(p);
    setUsers(users.data);
    setPage(users.page);
    setTotalPage(users.totalPage);
  };
  useEffect(() => {
    const getUsers = async () => {
      const result = await getAllUserForAdmin();
      if (result.status === "success") {
        setUsers(result.data);
        setTotalPage(result.totalPage);
        setPage(result.page);
      }
    };

    getUsers();
  }, []);

  const prperty = [
    "image",
    "username",
    "nim",
    "fullname",
    "email",
    "phone",
    "action",
  ];
  return (
    <>
      {showForm && (
        <div className="fixed inset-0 w-screen h-screen bg-black/20"></div>
      )}
      {showForm && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-md p-4 md:w-sm">
          <button
            onClick={() => setShowForm(!showForm)}
            className="cursor-pointer"
          >
            <X />
          </button>
            <AddUserForm showForm={showForm} setShowForm={setShowForm} setPage={setPage} setTotalPage={setTotalPage} setUsers={setUsers} page={page} />
        </div>
      )}

      <div className="flex justify-between items-center my-8">
        <Link to={"/admin"} className="block">
          <ArrowLeft />
        </Link>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 block px-4 py-2 rounded-md text-white flex items-center gap-2 cursor-pointer border border-transparent hover:bg-transparent hover:text-gray-800 hover:border-gray-800 transition-duration"
        >
          <div className="size-5">
            <UserIcon className="w-full h-full" />
          </div>
          <p className="font-semibold">Tambah User</p>
        </button>
      </div>
      <div className="px-4 py-6 mt-8 bg-white shadow-md w-full">
        <h1 className="font-semibold md:text-xl uppercase">User</h1>
        <span className="inline-block w-8 h-1 bg-gray-800"></span>
        <div className="mt-8 py-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {prperty.map((data) => (
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
              {users.map((value) => (
                <tr
                  key={value.id}
                  className="flex flex-row hover:shadow-md cursor-pointer transition-all transition-duration justify-between gap-4 items-center md:table-row mb-4 md:mb-0 md:border-b-4 border-gray-600 md:border-none md:p-0"
                >
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link
                      to={`/admin/user/${value.id}`}
                      className="block size-16 rounded-full overflow-hidden"
                    >
                      {value?.url_photo ? (
                        <img
                          className="w-full h-full object-center object-cover"
                          src={value.url_photo}
                          alt="image user"
                        />
                      ) : (
                        <img
                          className="w-full h-full object-cover object-center"
                          src="/avatar.png"
                          alt=""
                        />
                      )}
                    </Link>
                  </td>
                  <td className="md:px-6 hidden py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/user/${value.id}`}>{value.username}</Link>
                  </td>
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/user/${value.id}`}>{value.nim}</Link>
                  </td>
                  <td className="md:px-6 hidden py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/user/${value.id}`}>
                      {value.full_name}
                    </Link>
                  </td>
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/user/${value.id}`}>{value.email}</Link>
                  </td>
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <Link to={`/admin/user/${value.id}`}>{value.phone}</Link>
                  </td>
                  <td className="md:px-6 py-2 md:py-4 text-left text-xs md:text-[16px] font-medium tracking-wide md:table-cell">
                    <div className="flex block gap-2">
                      <button onClick={() => deleteUserForAdmin(value.id, setUsers, page, setPage, setTotalPage)} className="cursor-pointer hover:bg-red-400 group p-1 bg-red-200 transition-color transition-duration rounded-md">
                        <Trash className="text-red-500 transition-color transition-duration group-hover:text-red-800" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end mt-6 gap-4 ">
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

export default User;
