import Axios from "axios";
import BASE_URL from "./index.js";

const login = async ({ username, password }) => {
  try {
    const response = await Axios.post(`${BASE_URL}/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (err) {
    return {
      status: "error",
      message: err.response.data.message,
    };
  }
};

const logout = async (token) => {
  try {
    const response = await Axios.post(`${BASE_URL}/logout`, null, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    return {
      status: "error",
      message: err.response.data,
    };
  }
};

export { login, logout };
