import BASE_URL from "./index.js";
import Axios from "axios";

export const addResponse = async (reqId, message, _isComplete, token) => {
  try {
    const response = await Axios.post(
      `${BASE_URL}/response`,
      {
        requestId: reqId,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;
    return result;
  } catch (err) {
    console.error(err);
  }
};

export const getResponseById = async (reqId, token, setResponses) => {
  try {
    const response = await Axios.get(`${BASE_URL}/response/${reqId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data;
    if (result.status === "success") {
        setResponses(result.data);
    } 
  } catch (err) {
    return {
      status: "error",
      error: err.response.data
    }
  }
};
