import { useState } from "react";
import { addUserForAdmin } from "../../../utils/action";
import { Eye, EyeClosed } from "lucide-react";

const AddUserForm = ({
  showForm,
  setShowForm,
  setUsers,
  setPage,
  setTotalPage,
  page,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [phone, setPhone] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(false);
  const [role, setRole] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
      full_name: fullName,
      email,
      role,
      nim,
      phone: `0${phone}`,
    };

    await addUserForAdmin(
      data,
      setErrMessage,
      setShowForm,
      showForm,
      setUsers,
      setPage,
      setTotalPage,
      page
    );
  };

  const onChangeHandler = (e, setValue) => {
    setValue(e.target.value);
  };
  return (
    <form onSubmit={submitHandler} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2">
        <label
          className="text-sm tracking-[3px] font-semibold uppercase"
          htmlFor=""
        >
          Username
        </label>
        <input
          onChange={(e) => onChangeHandler(e, setUsername)}
          value={username}
          className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
          type="text"
          name=""
          id=""
          placeholder="username"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm tracking-[3px] font-semibold uppercase"
          htmlFor=""
        >
          Password
        </label>
        <div className="relative">
          <input
            value={password}
            onChange={(e) => onChangeHandler(e, setPassword)}
            className="px-4 py-2 w-full bg-gray-100 focus:outline-none rounded-md shadow-md"
            type={!hiddenPassword ? "password" : "text"}
            name=""
            id=""
            placeholder="password"
          />
          <div
            onClick={() => setHiddenPassword(!hiddenPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {!hiddenPassword ? <EyeClosed /> : <Eye />}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm tracking-[3px] font-semibold uppercase"
          htmlFor=""
        >
          NIM
        </label>
        <input
          value={nim}
          onChange={(e) => onChangeHandler(e, setNim)}
          className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
          type="text"
          placeholder="NIM"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm tracking-[3px] font-semibold uppercase"
          htmlFor=""
        >
          Nama lengkap
        </label>
        <input
          onChange={(e) => onChangeHandler(e, setFullName)}
          value={fullName}
          className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
          type="text"
          name=""
          id=""
          placeholder="nama lengkap"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm tracking-[3px] font-semibold uppercase">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
        >
          <option disabled value="">
            --Pilih Role--
          </option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm tracking-[3px] font-semibold uppercase"
          htmlFor=""
        >
          Email
        </label>
        <input
          onChange={(e) => onChangeHandler(e, setEmail)}
          value={email}
          className="px-4 py-2 bg-gray-100 focus:outline-none rounded-md shadow-md"
          type="email"
          placeholder="email"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          className="text-sm tracking-[3px] font-semibold uppercase"
          htmlFor=""
        >
          No hp
        </label>
        <div className="flex items-center rounded-l-xl rounded-r-md shadow-md overflow-hidden">
          <p className="block px-2 py-2 text-gray-500 bg-gray-200">+62</p>
          <input
            onChange={(e) => onChangeHandler(e, setPhone)}
            value={phone}
            className="px-4 py-2 bg-gray-100 focus:outline-none flex-2"
            type="number"
            name=""
            id=""
            placeholder="phone"
          />
        </div>
      </div>
      <button
        className="mb-2 bg-blue-500 py-2 rounded-md text-white border border-transparent font-semibold hover:border-gray-800 hover:text-gray-800 hover:bg-transparent cursor-pointer transition-duration"
        type="submit"
      >
        Tambah User
      </button>
      <p className="text-red-500 font-semibold text-sm">{errMessage}</p>
    </form>
  );
};

export default AddUserForm;
