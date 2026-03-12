import axios from "axios";
import BASE_URL from ".";

const handleApiError = (err) => {
  console.error("API Error:", err);
  return {
    status: "fail",
    message: err.response?.data?.message || "Terjadi kesalahan pada server",
  };
};

const getHeaders = () => {
  const token = localStorage.getItem("tokenKey");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getBackupStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/backups/stats`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getBackupHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/backups/history`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const triggerBackup = async (type = "database") => {
  try {
    const response = await axios.post(
      `${BASE_URL}/backups/trigger`,
      { type },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const updateBackupConfig = async (config) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/backups/config`,
      config,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const downloadBackup = async (filename) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/backups/download/${filename}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const deleteBackup = async (filename) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/backups/${filename}`,
      { headers: getHeaders() }
    );
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};
