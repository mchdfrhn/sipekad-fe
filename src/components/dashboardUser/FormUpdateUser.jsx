import UploadWidget from "../ui/UploadWidget";
import { useState } from "react";
import { updateProfile } from "../../utils/api/user";
import { useUser } from "../../utils/hooks/userContext";
import { X } from "lucide-react";

const FormUpdateUser = ({ showForm, setShowForm }) => {
  const { updateUserData } = useUser();
  const { email, phone, username, id, full_name, nim, role } = JSON.parse(
    localStorage.getItem("user")
  );

  const { url_photo: initialUrl } = JSON.parse(localStorage.getItem("user"));
  const [usernameInput, setUsername] = useState(username);
  const [emailInput, setEmail] = useState(email);
  const [phoneInput, setPhone] = useState(phone);
  const [urlPhoto, setUrlPhoto] = useState(initialUrl);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const newUpdateUser = {
      email: emailInput,
      username: usernameInput,
      id,
      full_name,
      nim,
      phone: phoneInput,
      url_photo: urlPhoto,
      role,
    };
    await updateProfile(
      {
        username: usernameInput,
        email: emailInput,
        phone: phoneInput,
        url_photo: urlPhoto,
        full_name,
      },
      updateUserData,
      newUpdateUser,
      setShowForm,
      showForm
    );
  };

  return (
    <>
      <div className="fixed bg-white py-4 px-4 rounded-md shadow-md z-20 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <button onClick={() => setShowForm(!showForm)} className="cursor-pointer">
        <X />
      </button>
        <div className="md:flex mt-2 xl:items-center gap-4">
          <div>
            <div className="size-30 mx-auto shadow-md p-2 rounded-md overflow-hidden">
              <img
                className="w-full h-full object-top object-cover"
                src={urlPhoto ? urlPhoto : "/avatar.png"}
                alt="foto user"
              />
            </div>
            <UploadWidget setPublicId={setUrlPhoto} />
          </div>
          <form className="flex flex-col gap-2" onSubmit={onSubmitHandler}>
            <input
              className="border px-2 rounded-md focus:outline-none"
              type="text"
              name="username"
              value={usernameInput}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              className="border px-2 rounded-md focus:outline-none"
              type="string"
              name="phone"
              value={phoneInput}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
            <input
              className="border px-2 rounded-md focus:outline-none"
              type="text"
              name="email"
              value={emailInput}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
            <button className="w-full bg-blue-500 text-white py-1 rounded-md text-sm cursor-pointer border border-transparent hover:bg-transparent hover:border-gray-800 transition-duration mt-4 hover:text-gray-800" type="submit">
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormUpdateUser;
