import { useState } from "react";
import { addUserForAdmin } from "../../../utils/action";
import { Eye, EyeClosed, X } from "lucide-react";
import { STUDENT_PRODI } from "../../../utils/constant";
import CustomSelect from "../../ui/CustomSelect";
import { useToast } from "@/utils/hooks/useToast";

const prodiOptions = Object.values(STUDENT_PRODI).map((val) => ({
  label: val,
  value: val,
}));

const AddUserForm = ({
  showForm,
  setShowForm,
  setUsers,
  setPage,
  setTotalPage,
  page,
  limit,
  prodi,
  search,
}) => {
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [nik, setNik] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");
  const [phone, setPhone] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [role] = useState("user"); // Default to user as requested

  const validateForm = () => {
    if (!username || username.length < 3)
      return "Username must be at least 3 characters";
    if (!password || password.length < 6)
      return "Password must be at least 6 characters";
    if (!fullName || fullName.length < 3)
      return "Full Name must be at least 3 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address";
    if (!nim) return "NIM / ID is required";
    if (!nik || nik.length < 16) return "NIK must be 16 characters";
    if (!selectedProdi) return "Please select a Program Studi";
    if (!phone || phone.length < 10) return "Please enter a valid phone number";
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrMessage(validationError);
      return;
    }
    const data = {
      username,
      password,
      full_name: fullName,
      email,
      role,
      nim,
      phone: `0${phone}`,
      nik,
      prodi: selectedProdi,
    };

    const result = await addUserForAdmin(
      data,
      setErrMessage,
      setShowForm,
      showForm,
      setUsers,
      setPage,
      setTotalPage,
      page,
      limit,
      prodi,
      search,
    );

    if (result && result.status === "success") {
      showToast("User baru berhasil ditambahkan", "success");
    } else if (result && result.status === "fail") {
      showToast(errMessage || "Gagal menambahkan user", "error");
    }
  };

  const onChangeHandler = (e, setValue) => {
    setValue(e.target.value);
  };
  return (
    <>
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(!showForm)}
            className="fixed inset-0 w-screen h-screen bg-[#111c44]/30 backdrop-blur-[2px] z-99"
          ></div>
          <div className="flex flex-col gap-4 bg-white shadow-2xl p-8 h-[90vh] md:h-auto max-h-[95vh] overflow-y-auto rounded-[30px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 w-[90%] max-w-[500px] border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-extrabold text-[#2B3674] tracking-tight">
                Add New Student
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submitHandler} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Full Name
                </label>
                <input
                  onChange={(e) => onChangeHandler(e, setFullName)}
                  value={fullName}
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  type="text"
                  placeholder="Enter full name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Username
                </label>
                <input
                  onChange={(e) => onChangeHandler(e, setUsername)}
                  value={username}
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  type="text"
                  placeholder="Enter username"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => onChangeHandler(e, setPassword)}
                    className="px-4 py-3 w-full bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                    type={!hiddenPassword ? "password" : "text"}
                    placeholder="Enter password"
                  />
                  <div
                    onClick={() => setHiddenPassword(!hiddenPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#4318FF]"
                  >
                    {!hiddenPassword ? (
                      <EyeClosed className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  NIM / ID
                </label>
                <input
                  value={nim}
                  onChange={(e) => onChangeHandler(e, setNim)}
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  type="text"
                  placeholder="Enter NIM/ID"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  NIK
                </label>
                <input
                  value={nik}
                  onChange={(e) => onChangeHandler(e, setNik)}
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  type="text"
                  placeholder="Enter NIK"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Program Studi
                </label>
                <CustomSelect
                  value={selectedProdi}
                  onChange={setSelectedProdi}
                  options={prodiOptions}
                  placeholder="Select Program Studi"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Email Address
                </label>
                <input
                  onChange={(e) => onChangeHandler(e, setEmail)}
                  value={email}
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  type="email"
                  placeholder="Enter email address"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Phone Number
                </label>
                <div className="flex items-center bg-[#F4F7FE] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4318FF] transition-all duration-200">
                  <p className="px-4 py-3 text-gray-500 bg-gray-100 font-bold border-r border-gray-200">
                    +62
                  </p>
                  <input
                    onChange={(e) => onChangeHandler(e, setPhone)}
                    value={phone}
                    className="px-4 py-3 bg-transparent text-[#2B3674] font-semibold border-none outline-none flex-1"
                    type="number"
                    placeholder="8123456789"
                  />
                </div>
              </div>
              <button
                className="mt-4 bg-[#4318FF] text-white py-3 rounded-2xl text-sm font-bold shadow-[0_4px_14px_0_rgba(67,24,255,0.39)] hover:shadow-[0_6px_20px_rgba(67,24,255,0.23)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                type="submit"
              >
                Add Student
              </button>
            </form>
            <p className="text-center text-xs font-bold text-red-500 mt-2">
              {errMessage}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default AddUserForm;
