import Axios from "axios";
import BASE_URL from "./index.js";

/**
 * Resolve S3 URL → presigned URL via BE.
 * Returns the signed URL string, or the original url as fallback.
 */
export const getSignedUrl = async (s3Url) => {
  if (!s3Url) return null;
  try {
    const token = localStorage.getItem("tokenKey");
    const res = await Axios.get(`${BASE_URL}/storage/signed-url`, {
      params: { url: s3Url },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.url || s3Url;
  } catch {
    return s3Url; // fallback ke original url
  }
};
