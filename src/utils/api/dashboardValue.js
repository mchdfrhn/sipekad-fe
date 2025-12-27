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

export const getDistribusiPengajuan = async (setLabel, setData) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(
      `${BASE_URL}/dashboard/distribusi-pengajuan`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = response.data;
    if (result.status === "success") {
      setLabel(result.label);
      setData(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getTopTypePengajuan = async (setLabel, setData) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/top-pengajuan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    if (result.status === "success") {
      setLabel(result.label);
      setData(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getStatusPengajuan = async (setLabel, setData) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/status-pengajuan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = response.data;
    if (result.status === "success") {
      setLabel(result.label);
      setData(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getSummeryDataByUserId = async (setSummery, userId) => {
  const token = localStorage.getItem("tokenKey");
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/summery/${userId}`, {
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
}