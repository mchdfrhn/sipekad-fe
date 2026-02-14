import {
  Trash,
  ArrowLeft,
  ArrowRight,
  User as UserIcon,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllUserForAdmin } from "../../../utils/api/user";
import { Link, useSearchParams } from "react-router";
import AddUserForm from "./AddUserForm";
import { deleteUserForAdmin } from "../../../utils/action";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { LoadingOverlay, TableSkeleton } from "@/components/ui/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STUDENT_PRODI } from "@/utils/constant";
import { useToast } from "@/utils/hooks/useToast";

const User = () => {
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [alertDelete, setAlertDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const limit = 15;
  const [domReady, setDomReady] = useState(false);
  const [filterProdi, setFilterProdi] = useState("default");
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const [loading, setLoading] = useState(true);

  const handlePageChange = async (p) => {
    setLoading(true);
    const users = await getAllUserForAdmin(p, limit, filterProdi, searchTerm);
    if (users.status === "success") {
      setUsers(users.data);
      setPage(users.page);
      setTotalPage(users.totalPage);
    }
    setLoading(false);
  };

  const handleFilterProdi = async (prodi) => {
    setLoading(true);
    setFilterProdi(prodi);
    setPage(1);
    const result = await getAllUserForAdmin(1, limit, prodi, searchTerm);
    if (result.status === "success") {
      setUsers(result.data);
      setTotalPage(result.totalPage);
      setPage(result.page);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const result = await getAllUserForAdmin(
        1,
        limit,
        filterProdi,
        searchTerm,
      );
      if (result.status === "success") {
        setUsers(result.data);
        setTotalPage(result.totalPage);
        setPage(result.page);
      }
      setLoading(false);
    };

    getUsers();
    setDomReady(true);
  }, [filterProdi, searchTerm]);

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setAlertDelete(true);
  };

  const confirmDelete = async () => {
    if (selectedUserId) {
      const result = await deleteUserForAdmin(
        selectedUserId,
        setUsers,
        page,
        setPage,
        setTotalPage,
        limit,
        filterProdi,
        searchTerm,
      );

      if (result && result.status === "success") {
        showToast("User berhasil dihapus", "success");
      } else {
        showToast("Gagal menghapus user", "error");
      }

      setAlertDelete(false);
      setSelectedUserId(null);
    }
  };

  const headers = [
    "No",
    "Nama Lengkap",
    "NIM",
    "Prodi",
    "Email",
    "No. Telepon",
    "Aksi",
  ];

  const prodiOptions = [
    { label: "Semua Prodi", value: "default" },
    ...Object.values(STUDENT_PRODI).map((prodi) => ({
      label: prodi,
      value: prodi,
    })),
  ];

  return (
    <>
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(!showForm)}
            className="fixed inset-0 w-screen h-screen bg-black/20 backdrop-blur-sm flex justify-center z-40 items-center"
          ></div>
          <AddUserForm
            showForm={showForm}
            setShowForm={setShowForm}
            setPage={setPage}
            setTotalPage={setTotalPage}
            setUsers={setUsers}
            page={page}
            limit={limit}
            prodi={filterProdi}
            search={searchTerm}
          />
        </>
      )}

      {/* Portal Button to Header */}
      {domReady &&
        document.getElementById("header-actions") &&
        createPortal(
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4318FF] hover:bg-[#3311CC] text-white rounded-full px-4 py-3 text-sm font-bold shadow-[0_4px_14px_0_rgba(67,24,255,0.39)] hover:shadow-[0_6px_20px_rgba(67,24,255,0.23)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mr-2"
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah User
          </Button>,
          document.getElementById("header-actions"),
        )}

      <div className="flex flex-col h-full gap-4">
        <Card className="border-0 shadow-lg rounded-[20px] bg-white flex-1 flex flex-col">
          <CardContent className="p-0 pb-6 flex-1 flex flex-col justify-between relative">
            {loading && <LoadingOverlay />}
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {headers.map((header) => {
                      if (header === "Prodi") {
                        return (
                          <th key={header} className="px-6 py-3 text-left">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#4318FF] focus:outline-none transition-colors cursor-pointer">
                                {header} <Filter className="h-3 w-3" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                className="bg-white border-none shadow-xl"
                              >
                                {prodiOptions.map((option) => (
                                  <DropdownMenuItem
                                    key={option.value}
                                    onClick={() =>
                                      handleFilterProdi(option.value)
                                    }
                                    className={`cursor-pointer capitalize px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg ${
                                      filterProdi === option.value
                                        ? "bg-indigo-50 text-[#4318FF]"
                                        : "text-[#2B3674] hover:bg-indigo-50 hover:text-[#4318FF]"
                                    }`}
                                  >
                                    {option.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </th>
                        );
                      }
                      return (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="px-6 py-8 text-center text-gray-500 text-sm"
                      >
                        Tidak ada data user.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {users.map((value, index) => (
                        <tr
                          key={value.id}
                          className={`group transition-colors border-b border-gray-50 last:border-0 hover:bg-blue-50/50 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#2B3674]">
                              {(page - 1) * limit + index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Link to={`/admin/user/${value.id}`}>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={value?.url_photo}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="bg-blue-100 text-[#4318FF] font-bold text-xs">
                                    {value.full_name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                              <Link
                                to={`/admin/user/${value.id}`}
                                className="text-sm font-bold text-[#2B3674] hover:text-[#4318FF]"
                              >
                                {value.full_name}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#2B3674]">
                              {value.nim}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <span className="text-sm font-bold text-[#2B3674] capitalize">
                              {value.prodi || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {value.email}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <span className="text-sm text-gray-600">
                              {value.phone}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(value.id)}
                              className="h-8 w-8 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {/* Render Empty Rows to maintain height */}
                      {limit - users.length > 0 &&
                        [...Array(limit - users.length)].map((_, i) => (
                          <tr
                            key={`empty-${i}`}
                            className="border-b border-gray-50 last:border-0 h-[48px]"
                          >
                            <td
                              colSpan={headers.length}
                              className="px-6 py-2.5 whitespace-nowrap"
                            >
                              &nbsp;
                            </td>
                          </tr>
                        ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex justify-center items-center gap-2 mt-auto pt-6 border-t border-gray-50">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                {[...Array(totalPage)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={page === pageNumber ? "default" : "ghost"}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`h-8 w-8 rounded-full p-0 text-xs font-bold ${
                        page === pageNumber
                          ? "bg-[#4318FF] text-white hover:bg-[#3311CC]"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPage}
                  className="rounded-full hover:bg-gray-100 disabled:opacity-50"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <ConfirmDialog
          isOpen={alertDelete}
          onClose={() => setAlertDelete(false)}
          onConfirm={confirmDelete}
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."
          confirmText="Delete User"
          variant="danger"
        />
      </div>
    </>
  );
};

export default User;
