import { getRequest, postrequest } from "./api/request";
import { addResponse } from "./api/response";
import { uploadPdf } from "./api/uploadPdf.js";
import { getAllRequestForAdmin } from "./api/request";

export const requestPengajuan = async (type, message, file, navigate) => {
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
      if (resultUpload.status === "success") {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  }
};

export const addResponseHandler = async (e,{ id, message, isComplete, file }, navigate ) => {
  const token = localStorage.getItem("tokenKey");
  e.preventDefault();
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
      if (resultUpload.status === "success") {
        navigate("/dashboard");
      }
    }
    navigate("/admin/pengajuan");
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
