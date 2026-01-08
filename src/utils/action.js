import { getRequest, postrequest } from "./api/request";
import { addResponse } from "./api/response";
import { uploadPdf } from "./api/uploadPdf.js";
import { getAllRequestForAdmin} from "./api/request";
import {
  addUser,
  deleteUser,
  getAllUserForAdmin,
  updateUserForAdmin,
} from "./api/user.js";
import { login } from "./api/auth.js";

export const requestPengajuan = async (
  type,
  message,
  file,
  setDisplayModal,
  displayModal,
  setLoading
) => {
  const token = localStorage.getItem("tokenKey");
  const response = await postrequest(token, {
    type,
    message,
  });

  if (response.status === "success") {
    if (file) {
      const pengajuanId = response.pengajuanId;
      const resultUpload = await uploadPdf(
        file,
        pengajuanId,
        token,
        "upload-request"
      );

      console.log(resultUpload);
    }
    
    setDisplayModal(!displayModal);
    setLoading(false);
  }
};

export const addResponseHandler = async (
  { id, message, isComplete, file },
  setDisplayModal, displayModal, setLoading, setErrorMessage
) => {
  const token = localStorage.getItem("tokenKey");
  if (!message) {
    setErrorMessage("Pesan tidak boleh kosong");
    setLoading(false)
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
          "upload-response"
        );
        console.log(resultUpload)
      }
      setDisplayModal(!displayModal);
      setLoading(false);
    }
  }
};

export const filterStatus = async (
  status,
  setRequest,
  setPage,
  setTotalPage,
  getAllData,
  page = 1
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
  page = 1
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
  page
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
    const users = await getAllUserForAdmin(page);
    setUsers(users.data);
    setPage(users.page);
    setTotalPage(users.totalPage);
  }
};

export const deleteUserForAdmin = async (
  userId,
  setUsers,
  page,
  setPage,
  setTotalPage
) => {
  const token = localStorage.getItem("tokenKey");
  const result = await deleteUser(token, userId);
  if (result.status === "success") {
    const users = await getAllUserForAdmin(page);
    setUsers(users.data);
    setPage(users.page);
    setTotalPage(users.totalPage);
  }
};

export const updateUserForAdminAction = async (
  userId,
  data,
  navigate,
  setErrorMessage
) => {
  const token = localStorage.getItem("tokenKey");
  const result = await updateUserForAdmin(token, userId, data);
  if (result.status === "fail") {
    const messages = Object.values(result.message).flat();
    setErrorMessage(messages[0]);
  }
  if (result.status === "success") {
    navigate("/admin/user");
  }
};

export const loginFlow = async (
  data,
  updateUserData,
  navigate,
  setErrMessage,
  setLoading
) => {
  const result = await login(data);
  if (result.status === "success") {
    localStorage.setItem("tokenKey", result.accessToken);
    updateUserData(result.user);
    localStorage.setItem("user", JSON.stringify(result.user));
    navigate("/dashboard");
    if (result.user.role === "admin") {
      navigate("/admin");
    }
  }
  setLoading(false)
  if (result.status === "error") {
    setErrMessage("Email atau password salah");
  }
};
