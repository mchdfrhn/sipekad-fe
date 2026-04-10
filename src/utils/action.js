import { getRequest, postrequest } from "./api/request";
import { addResponse } from "./api/response";
import { uploadPdf } from "./api/uploadPdf.js";
import { getAllRequestForAdmin } from "./api/request";
import {
  addUser,
  deleteUser,
  getAllUserForAdmin,
  updateUserForAdmin,
} from "./api/user.js";
import { login, register } from "./api/auth.js";

export const registerFlow = async (data, navigate, setLoading) => {
  const result = await register(data);
  setLoading(false);
  if (result.status === "success") {
    navigate("/login");
    return { status: "success", message: result.message };
  }

  return { 
    status: "error", 
    message: typeof result.message === "object" 
      ? Object.values(result.message).flat()[0] 
      : (result.message || "Registrasi gagal dilakukan")
  };
};

export const requestPengajuan = async (
  type,
  message,
  file,
  setDisplayModal,
  displayModal,
  setLoading,
  setErr,
) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await postrequest(token, {
      type,
      message,
    });
    console.log(response);
    if (response.status === "success") {
      if (file) {
        const pengajuanId = response.pengajuanId;
        const resultUpload = await uploadPdf(
          file,
          pengajuanId,
          token,
          "upload-request",
        );
        console.log(resultUpload);
      }

      if (setDisplayModal) setDisplayModal(!displayModal);
      if (setLoading) setLoading(false);
      return response;
    }

    if (response.status === "faiil") {
      if (setDisplayModal) setDisplayModal(true);
      if (setLoading) setLoading(false);
      if (setErr) setErr(true);
    }
    return response;
  } catch (error) {
    if (setLoading) setLoading(false);
    return {
      status: "fail",
      message: error.message || "Internal server error",
    };
  }
};

export const addResponseHandler = async (
  { id, message, isComplete, file },
  setDisplayModal,
  displayModal,
  setLoading,
  setErrorMessage,
) => {
  const token = localStorage.getItem("tokenKey");
  if (!message) {
    setErrorMessage("Pesan tidak boleh kosong");
    setLoading(false);
    return;
  } else {
    const result = await addResponse(id, message, isComplete, token);
    if (result.status === "success") {
      if (file) {
        const responseId = result.responseId;
        const resultUpload = await uploadPdf(
          file,
          responseId,
          token,
          "upload-response",
        );
        console.log(resultUpload);
      }
      setDisplayModal(!displayModal);
      setLoading(false);
      return result;
    }
    return result;
  }
};

export const filterStatus = async (
  status,
  setRequest,
  setPage,
  setTotalPage,
  getAllData,
  page = 1,
) => {
  let result;

  if (!getAllData) {
    result = await getAllRequestForAdmin(page, status);
  } else {
    result = await getAllRequestForAdmin();
  }

  if (result.status === "success") {
    setRequest(result.data);
    setPage(result.page);
    setTotalPage(result.totalPage);
  }
};

export const filterStatusForUserDetail = async (
  status,
  setRequest,
  setPage,
  setTotalPage,
  getAllData,
  userId,
  page = 1,
) => {
  let result;

  if (!getAllData) {
    result = await getRequest(userId, page, status);
  } else {
    result = await getRequest(userId);
  }

  if (result.status === "success") {
    setRequest(result.data);
    setPage(result.page);
    setTotalPage(result.totalPage);
  }
};

export const addUserForAdmin = async (
  data,
  setErrorMessage,
  setShowForm,
  showForm,
  setUsers,
  setPage,
  setTotalPage,
  page,
  limit,
  prodi,
  search,
) => {
  const token = localStorage.getItem("tokenKey");
  const result = await addUser(token, data);
  if (result.status === "fail") {
    const messages = Object.values(result.message).flat();
    setErrorMessage(messages[0]);
  }

  console.log(result);

  if (result.error === "23505") {
    setErrorMessage("Data sudah terdaftar");
  }

  if (result.status === "success") {
    setShowForm(!showForm);
    const users = await getAllUserForAdmin(page, limit, prodi, search);
    setUsers(users.data);
    setPage(users.page);
    setTotalPage(users.totalPage);
    return result;
  }
  return result;
};

export const deleteUserForAdmin = async (
  userId,
  setUsers,
  page,
  setPage,
  setTotalPage,
  limit,
  prodi,
  search,
  onSuccess, // Added callback
) => {
  const token = localStorage.getItem("tokenKey");
  const result = await deleteUser(token, userId);
  if (result.status === "success") {
    if (onSuccess) onSuccess(); // Execute callback
    const users = await getAllUserForAdmin(page, limit, prodi, search);
    setUsers(users.data);
    setPage(users.page);
    setTotalPage(users.totalPage);
    return result; // Return result for toast
  }
  return result;
};

export const updateUserForAdminAction = async (
  userId,
  data,
  navigate,
  setErrorMessage,
) => {
  const token = localStorage.getItem("tokenKey");
  const result = await updateUserForAdmin(token, userId, data);
  if (result.status === "fail") {
    const messages = Object.values(result.message).flat();
    setErrorMessage(messages[0]);
  }
  console.log(result);
  console.log(data.prodi);

  if (result.status === "success") {
    navigate("/admin/user");
    return result;
  }
  return result;
};

export const loginFlow = async (data, updateUserData, navigate, setLoading) => {
  const result = await login(data);
  if (result.status === "success") {
    localStorage.setItem("tokenKey", result.accessToken);
    updateUserData(result.user);
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("loginTimestamp", Date.now().toString());
    if (result.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
    return { status: "success" };
  }

  setLoading(false);
  return { status: "error", message: result.message || "Email atau password salah" };
};
