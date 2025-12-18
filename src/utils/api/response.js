import BASE_URL from "./index.js";
import Axios from "axios";

export const addResponse = async (reqId, message, isComplete, token) => {
  try {
    const response = await Axios.post(
      `${BASE_URL}/response`,
      {
        requestId: reqId,
        message,
        isComplete,
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
    console.log(result)
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
