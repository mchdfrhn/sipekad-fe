import axios from "axios";
import BASE_URL from ".";

const handleApiError = (err) => {
  console.error("API Error:", err);
  return {
    status: "fail",
    message: err.response?.data?.message || "Terjadi kesalahan pada server",
  };
};

const getUser = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

const updateProfile = async (
  { username, email, phone, url_photo, full_name, nim, nik, prodi },
  updateUserData,
  updateUser,
  setShowProfile,
  showProfile,
) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("tokenKey");
  const { id } = user;
  try {
    const response = await axios.put(
      `${BASE_URL}/users/${id}`,
      {
        username,
        email,
        phone,
        url_photo,
        full_name,
        nim,
        nik,
        prodi,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.data.status === "success") {
      updateUserData(updateUser);
      if (setShowProfile) setShowProfile(!showProfile);
    }
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// admin
const getAllUserForAdmin = async (
  pageNumber = 1,
  limit = 10,
  prodi = "default",
  search = "",
) => {
  const token = localStorage.getItem("tokenKey");
  let url = `${BASE_URL}/users?page=${pageNumber}&limit=${limit}`;

  if (prodi && prodi !== "default") {
    url += `&prodi=${prodi}`;
  }

  if (search) {
    url += `&search=${search}`;
  }

  try {
    const result = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (err) {
    return handleApiError(err);
  }
};

const getUserDetail = async (token, userId) => {
  try {
    const result = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const addUser = async (
  token,
  { username, password, nim, full_name, email, phone, role, nik, prodi },
) => {
  try {
    const result = await axios.post(
      `${BASE_URL}/users`,
      {
        username,
        password,
        nim,
        full_name,
        email,
        phone,
        role,
        nik,
        prodi,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const deleteUser = async (token, userId) => {
  try {
    const result = await axios.delete(`${BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const updateUserForAdmin = async (
  token,
  userId,
  { username, full_name, nim, email, phone, nik, prodi },
) => {
  try {
    const result = await axios.put(
      `${BASE_URL}/users/${userId}`,
      {
        username,
        full_name,
        nim,
        email,
        phone,
        nik,
        prodi,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const changePassword = async (
  token,
  { currentPassword, newPassword },
) => {
  try {
    const result = await axios.put(
      `${BASE_URL}/users/change-password`,
      { currentPassword, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return result.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const resetPasswordApi = async (token, userId) => {
  try {
    const result = await axios.put(
      `${BASE_URL}/users/${userId}/reset-password`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return result.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export { getUser, updateProfile, getAllUserForAdmin, getUserDetail };
