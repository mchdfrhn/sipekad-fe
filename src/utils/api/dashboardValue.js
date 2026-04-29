import BASE_URL from "./index.js";
import axios from "axios";

export const getSummeryData = async (setSummery) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/summery`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    if (result.status === "success") {
      setSummery(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getDistribusiPengajuan = async (setLabel, setData, days = 30) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(
      `${BASE_URL}/dashboard/distribusi-pengajuan?days=${days}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = response.data;
    if (result.status === "success") {
      if (typeof setLabel === "function") setLabel(result.label);
      if (typeof setData === "function") setData(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getTopTypePengajuan = async (setLabel, setData, days = 30) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/top-pengajuan?days=${days}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    if (result.status === "success") {
      if (typeof setLabel === "function") setLabel(result.label);
      if (typeof setData === "function") setData(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getStatusPengajuan = async (setLabel, setData, days = 30) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/status-pengajuan?days=${days}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    if (result.status === "success") {
      if (typeof setLabel === "function") setLabel(result.label);
      if (typeof setData === "function") setData(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getSummeryDataByUserId = async (setSummery, userId) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(
      `${BASE_URL}/dashboard/summery/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = response.data;
    if (result.status === "success") {
      setSummery(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getDashboardActivities = async (
  setActivities,
  setNotifications,
) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/activities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    if (result.status === "success") {
      if (typeof setActivities === "function")
        setActivities(result.data.activities || []);
      if (typeof setNotifications === "function")
        setNotifications(result.data.notifications || []);
    }
  } catch (err) {
    console.error(err);
  }
};

export const markAsRead = async (id) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.patch(
      `${BASE_URL}/dashboard/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("markAsRead error:", error.response?.data || error.message);
    } else {
      console.error("markAsRead unexpected error:", error);
    }
    throw error;
  }
};
