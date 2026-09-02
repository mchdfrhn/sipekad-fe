import { useEffect, useState } from "react";
import { motion as Motion } from "motion/react";
import { CheckCircle, XCircle } from "lucide-react";
import { getPendingUsers, approveUserApi, rejectUserApi } from "../../../utils/api/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyState from "../../ui/EmptyState";
import { LoadingOverlay } from "@/components/ui/Loading";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useToast } from "@/utils/hooks/useToast";
import { Link } from "react-router";

const PendingUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, userId: null, name: "" });

  const fetchPending = async () => {
    setLoading(true);
    const result = await getPendingUsers();
    if (result.status === "success") setUsers(result.data);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const openConfirm = (type, userId, name) => {
    setConfirmDialog({ open: true, type, userId, name });
  };

  const handleConfirm = async () => {
    const { type, userId } = confirmDialog;
    setConfirmDialog({ open: false, type: null, userId: null, name: "" });
    const result = type === "approve"
      ? await approveUserApi(userId)
      : await rejectUserApi(userId);
    if (result.status === "success") {
      showToast(result.message, "success");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      showToast(result.message || "Gagal memproses akun", "error");
    }
  };

  const headers = ["No", "Nama Lengkap", "NIM", "Prodi", "Email", "No. Telepon", "Aksi"];

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: null, userId: null, name: "" })}
        onConfirm={handleConfirm}
        title={confirmDialog.type === "approve" ? "Setujui Akun" : "Tolak Akun"}
        description={
          confirmDialog.type === "approve"
            ? `Akun ${confirmDialog.name} akan diaktifkan dan bisa login.`
            : `Akun ${confirmDialog.name} akan dihapus permanen.`
        }
        confirmText={confirmDialog.type === "approve" ? "Setujui" : "Tolak"}
        confirmClassName={confirmDialog.type === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
      />

      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col h-full gap-4"
      >
        {/* Tab navigasi */}
        <div className="flex gap-2 border-b border-gray-100 pb-0">
          <Link
            to="/admin/user"
            className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-[#4318FF] -mb-px"
          >
            Semua User
          </Link>
          <Link
            to="/admin/user/pending"
            className="px-4 py-2 text-sm font-semibold text-[#4318FF] border-b-2 border-[#4318FF] -mb-px flex items-center gap-1.5"
          >
            Menunggu Persetujuan
            {users.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {users.length}
              </span>
            )}
          </Link>
        </div>

        <Card className="border-0 shadow-lg rounded-[20px] bg-white flex-1 flex flex-col">
          <CardContent className="p-0 pb-6 flex-1 flex flex-col justify-between relative">
            {loading && <LoadingOverlay />}

            {!loading && users.length === 0 ? (
              <EmptyState
                variant="data"
                title="Tidak ada pendaftar baru"
                description="Semua akun sudah diproses."
              />
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {headers.map((h) => (
                        <th
                          key={h}
                          className={`px-4 md:px-6 py-3 text-left text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ${
                            ["Email", "No. Telepon"].includes(h) ? "hidden lg:table-cell" : ""
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <Motion.tr
                        key={u.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className={`group transition-colors border-b border-gray-50 last:border-0 hover:bg-amber-50/50 ${
                          i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-4 md:px-6 py-2.5 whitespace-nowrap">
                          <span className="text-xs md:text-sm font-bold text-[#2B3674]">{i + 1}</span>
                        </td>
                        <td className="px-4 md:px-6 py-2.5 whitespace-nowrap">
                          <span className="text-xs md:text-sm font-bold text-[#2B3674]">{u.full_name}</span>
                        </td>
                        <td className="px-4 md:px-6 py-2.5 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#2B3674]">{u.nim}</span>
                        </td>
                        <td className="px-4 md:px-6 py-2.5 whitespace-nowrap">
                          <span className="text-xs md:text-sm text-[#2B3674] capitalize">{u.prodi || "-"}</span>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-2.5 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{u.email}</span>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-2.5 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{u.phone}</span>
                        </td>
                        <td className="px-4 md:px-6 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => openConfirm("approve", u.id, u.full_name)}
                              className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Setujui</span>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openConfirm("reject", u.id, u.full_name)}
                              className="h-8 gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Tolak</span>
                            </Button>
                          </div>
                        </td>
                      </Motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Motion.div>
    </>
  );
};

export default PendingUsers;
