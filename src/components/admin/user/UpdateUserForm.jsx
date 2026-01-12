import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { updateUserForAdminAction } from "../../../utils/action";
import { STUDENT_PRODI } from "../../../utils/constant";

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
      prodi: prodi.toLowerCase()
    };
    await updateUserForAdminAction(id, newData, navigate, setErrMessage);
  };

  return (
    <>
      {shwoForm && (
        <>
          <div
            onClick={() => setShowForm(!shwoForm)}
            className="fixed inset-0 w-screen h-screen bg-black/20 z-99"
          ></div>
          <div className="flex flex-col gap-4 mt-4 bg-white shadow-md p-4 h-[88vh] md:h-[64vh] xl:h-[88vh] overflow-y-scroll rounded-md fixed inset-0 w-[20rem] md:w-[30rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99">
            <button
              onClick={() => setShowForm(!shwoForm)}
              className="cursor-pointer"
            >
              <X />
            </button>
            <form
              onSubmit={submitHandler}
              className="flex flex-col gap-4 mt-4"
              action=""
            >
              <div className="flex flex-col gap-2 mt-2">
                <label
                  className="text-sm tracking-[3px] font-semibold uppercase"
                  htmlFor=""
                >
                  Username
                </label>
                <input
                  className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
                  onChange={(e) => onCHangeHandler(e, setFullName)}
                  type="text"
                  value={fullName}
                  name=""
                  id=""
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label
                  className="text-sm tracking-[3px] font-semibold uppercase"
                  htmlFor=""
                >
                  nama lengkap
                </label>
                <input
                  className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
                  onChange={(e) => onCHangeHandler(e, setUsername)}
                  type="text"
                  value={username}
                  name=""
                  id=""
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label
                  className="text-sm tracking-[3px] font-semibold uppercase"
                  htmlFor=""
                >
                  NIM
                </label>
                <input
                  className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
                  onChange={(e) => onCHangeHandler(e, setNim)}
                  type="text"
                  value={nim}
                  name=""
                  id=""
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label
                  className="text-sm tracking-[3px] font-semibold uppercase"
                  htmlFor=""
                >
                  Nik
                </label>
                <input
                  className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
                  onChange={(e) => onCHangeHandler(e, setNik)}
                  type="text"
                  value={nik}
                  name=""
                  id=""
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm tracking-[3px] font-semibold uppercase">
                  prodi
                </label>
                <select
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
                >
                  <option disabled value="">
                    --Pilih Prodi--
                  </option>
                  <option value={STUDENT_PRODI.TEKNIK_INFORMATIKA}>
                    Teknik Informatika
                  </option>
                  <option value={STUDENT_PRODI.TEKNIK_SIPIL}>
                    Teknik Sipil
                  </option>
                  <option value={STUDENT_PRODI.TEKNIK_LINGKUNGAN}>
                    Teknik Lingkungan
                  </option>
                </select>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label
                  className="text-sm tracking-[3px] font-semibold uppercase"
                  htmlFor=""
                >
                  email
                </label>
                <input
                  className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
                  onChange={(e) => onCHangeHandler(e, setEmail)}
                  type="text"
                  value={email}
                  name=""
                  id=""
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label
                  className="text-sm tracking-[3px] font-semibold uppercase"
                  htmlFor=""
                >
                  phone
                </label>
                <input
                  className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
                  onChange={(e) => onCHangeHandler(e, setPhone)}
                  type="text"
                  value={phone}
                  name=""
                  id=""
                />
              </div>
              <button
                className="mb-2 bg-yellow-500 py-2 rounded-md text-white border border-transparent font-semibold hover:border-gray-800 hover:text-gray-800 hover:bg-transparent cursor-pointer transition-duration"
                type="submit"
              >
                Updated User
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
