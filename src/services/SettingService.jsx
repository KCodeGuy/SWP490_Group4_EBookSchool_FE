import axios from "axios";
import { API_HOST } from "./APIConfig";

const getSetting = async () => {
  const res = await axios.get(`${API_HOST}/Setting`, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const updateSetting = async (data) => {
  try {
    const res = await axios.put(`${API_HOST}/Setting`, data, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};
export { getSetting, updateSetting };
