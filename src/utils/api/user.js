import Axios from "axios";
import BASE_URL from ".";

const getUser = async (token) => {
  try {
    const response = await Axios.get(`${BASE_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const updateProfile = async (
  { username, email, phone, url_photo, full_name },
  updateUserData,
  updateUser,
  navigate
) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("tokenKey");
  const { id } = user;
  try {
    const response = await Axios.put(
      `${BASE_URL}/users/${id}`,
      {
        username,
        email,
        phone,
        url_photo,
        full_name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.status === "success") {
      updateUserData(updateUser);
      navigate("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return {
      status: "fail",
      message: err.response.data.message,
    };
  }
};

// admin
const getAllUserForAdmin = async (page = 1) => {
  const token = localStorage.getItem("tokenKey")
  try {
    const result = await Axios.get(`${BASE_URL}/users?page=${page}&limit=5`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await result.data;
    return users;
  } catch (err) {
    return {
      success: false,
      error: err.response.data,
    };
  }
};

const getUserDetail = async (token, userId) => {
  try {
    const result = await Axios.get(`${BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await result.data;
    return users;
  } catch (err) {
    return {
      success: false,
      error: err.response.data,
    };
  }
};

export { getUser, updateProfile, getAllUserForAdmin, getUserDetail };
