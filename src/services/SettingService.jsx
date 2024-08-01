import axios from "axios";
import { API_HOST } from "./APIConfig";

const getSetting = async () => {
  try {
    const res = await axios.get(`${API_HOST}/Setting`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

const updateSetting = async (data) => {
  try {
    const res = await axios.put(`${API_HOST}/Setting`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};
export { getSetting, updateSetting };
