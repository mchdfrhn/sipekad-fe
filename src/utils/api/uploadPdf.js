import axios from "axios";
import BASE_URL from "./index.js";

export const uploadPdf = async (file, id, token, endpoint) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${BASE_URL}/${ endpoint }/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(err.response.data);
  }
};
