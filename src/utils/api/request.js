import BASE_URL from ".";
import Axios from "axios";
import { getResponseById } from "./response.js";

const postrequest = async (token, { type, message }) => {
  try {
    const response = await Axios.post(
      `${BASE_URL}/request`,
      {
        type,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (err) {
    console.log(err);
    return {
      status: err,
      message: err.response.data,
    };
  }
};

const getRequest = async (userId, page = 1, filterStatus = "") => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await Axios.get(
      `${BASE_URL}/request/user/${userId}?page=${page}&limit=10&filterStatus=${filterStatus}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (err) {
    return {
      status: "error",
      message: err.response.data.message,
      error: err.response.data.error_message,
    };
  }
};

export const getRequestDetail = async (requestId, setData, setResponses) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await Axios.get(`${BASE_URL}/request/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;
    console.log(result);
    if (result.status === "success") {
      setData(result.data);
      const id = result.data.id;
      await getResponseById(id, token, setResponses);
    }
  } catch (err) {
    console.error(err);
    return err.response.data;
  }
};

// admin
const getAllRequestForAdmin = async (
  pageNumber = 1,
  filterStatus = "",
  filterType = "",
) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const result = await Axios.get(
      `${BASE_URL}/request?page=${pageNumber}&limit=10&filterStatus=${filterStatus}&filterType=${filterType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const requests = await result.data;
    return requests;
  } catch (err) {
    return {
      success: false,
      error: err.response.data,
    };
  }
};

export { postrequest, getRequest, getAllRequestForAdmin };
