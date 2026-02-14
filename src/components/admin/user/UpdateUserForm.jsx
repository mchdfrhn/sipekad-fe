import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { updateUserForAdminAction } from "../../../utils/action";
import { STUDENT_PRODI } from "../../../utils/constant";
import CustomSelect from "../../ui/CustomSelect";

const prodiOptions = Object.values(STUDENT_PRODI).map((val) => ({
  label: val,
  value: val,
}));

const UpdateUserForm = ({ userDetail, shwoForm, setShowForm }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [id, setId] = useState("");
  const [nik, setNik] = useState("");
  const [prodi, setProdi] = useState("");

  const onCHangeHandler = (e, setData) => {
    setData(e.target.value);
  };

  useEffect(() => {
    if (userDetail) {
      setUsername(userDetail.username || "");
      setNim(userDetail.nim || "");
      setEmail(userDetail.email || "");
      setPhone(userDetail.phone || "");
      setFullName(userDetail.full_name || "");
      setId(userDetail.id || "");
      setProdi(userDetail.prodi || "");
      setNik(userDetail.nik || "");
    }
  }, [userDetail]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newData = {
      username,
      nim,
      email,
      phone,
      full_name: fullName,
      nik,
      prodi: prodi.toLowerCase(),
    };
    await updateUserForAdminAction(id, newData, navigate, setErrMessage);
  };

  return (
    <>
      {shwoForm && (
        <>
          <div
            onClick={() => setShowForm(!shwoForm)}
            className="fixed inset-0 w-screen h-screen bg-[#111c44]/30 backdrop-blur-[2px] z-99"
          ></div>
          <div className="flex flex-col gap-4 bg-white shadow-2xl p-8 h-[90vh] md:h-auto max-h-[90vh] overflow-y-auto rounded-[30px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[90%] max-w-[500px] border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-extrabold text-[#2B3674] tracking-tight">
                Update User Information
              </h2>
              <button
                onClick={() => setShowForm(!shwoForm)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={submitHandler}
              className="flex flex-col gap-4 mt-4"
              action=""
            >
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  onChange={(e) => onCHangeHandler(e, setFullName)}
                  type="text"
                  value={fullName}
                  id="fullName"
                  placeholder="Enter full name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  onChange={(e) => onCHangeHandler(e, setUsername)}
                  type="text"
                  value={username}
                  id="username"
                  placeholder="Enter username"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1"
                  htmlFor="nim"
                >
                  NIM / ID
                </label>
                <input
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  onChange={(e) => onCHangeHandler(e, setNim)}
                  type="text"
                  value={nim}
                  id="nim"
                  placeholder="Enter NIM/ID"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1"
                  htmlFor="nik"
                >
                  NIK
                </label>
                <input
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  onChange={(e) => onCHangeHandler(e, setNik)}
                  type="text"
                  value={nik}
                  id="nik"
                  placeholder="Enter NIK"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Program Studi
                </label>
                <CustomSelect
                  value={prodi}
                  onChange={setProdi}
                  options={prodiOptions}
                  placeholder="Select Program Studi"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  onChange={(e) => onCHangeHandler(e, setEmail)}
                  type="email"
                  value={email}
                  id="email"
                  placeholder="Enter email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="px-4 py-3 bg-[#F4F7FE] text-[#2B3674] font-semibold border-none focus:ring-2 focus:ring-[#4318FF] outline-none rounded-2xl transition-all duration-200"
                  onChange={(e) => onCHangeHandler(e, setPhone)}
                  type="text"
                  value={phone}
                  id="phone"
                  placeholder="Enter phone number"
                />
              </div>
              <button
                className="mt-4 bg-[#4318FF] text-white py-2.5 rounded-2xl text-sm font-bold shadow-[0_4px_14px_0_rgba(67,24,255,0.39)] hover:shadow-[0_6px_20px_rgba(67,24,255,0.23)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                type="submit"
              >
                Update Information
              </button>
            </form>
            <p className="text-xs font-semibold text-red-500">{errMessage}</p>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateUserForm;
