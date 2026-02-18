import { useState, useRef } from "react";
import { updateProfile } from "../../utils/api/user";
import { useUser } from "../../utils/hooks/userContext";
import { X, Camera, Loader2 } from "lucide-react";
import axios from "axios";

const FormUpdateUser = ({ showForm, setShowForm }) => {
  const { updateUserData } = useUser();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("tokenKey");
  const {
    email,
    phone,
    username,
    id,
    full_name,
    nim,
    role,
    url_photo: initialUrl,
  } = user;

  const [usernameInput, setUsername] = useState(username);
  const [emailInput, setEmail] = useState(email);
  const [phoneInput, setPhone] = useState(phone);
  const [urlPhoto, setUrlPhoto] = useState(initialUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users-photo/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status === "success" && response.data.url) {
        setUrlPhoto(response.data.url);
        // Update local user data state
        const updatedUser = { ...user, url_photo: response.data.url };
        updateUserData(updatedUser);
      }
    } catch (error) {
      console.error("Upload photo error:", error);
      alert("Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  };

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
      showForm,
    );
  };

  return (
    <>
      <div className="fixed bg-white py-4 px-4 rounded-md shadow-md z-20 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          onClick={() => setShowForm(!showForm)}
          className="cursor-pointer"
        >
          <X />
        </button>
        <div className="md:flex mt-2 xl:items-center gap-4">
          <div>
            <div
              className="size-30 mx-auto shadow-md p-2 rounded-md overflow-hidden relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <img
                className="w-full h-full object-top object-cover"
                src={urlPhoto ? urlPhoto : "/avatar.png"}
                alt="foto user"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-[10px] text-center mt-1 text-gray-500 font-medium">
              Klik foto untuk ganti
            </p>
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
            <button
              className="w-full bg-blue-500 text-white py-1 rounded-md text-sm cursor-pointer border border-transparent hover:bg-transparent hover:border-gray-800 transition-duration mt-4 hover:text-gray-800"
              type="submit"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormUpdateUser;
