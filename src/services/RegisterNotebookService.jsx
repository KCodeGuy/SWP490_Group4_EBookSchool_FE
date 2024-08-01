import axios from "axios";
import { API_HOST } from "./APIConfig";

const getRegisterNotebook = async (userID, userRole, accessToken, schoolWeek, classID) => {
  try {
    let params = {
      classID,
      fromDate: schoolWeek,
    };

    const res = await axios.get(`${API_HOST}/RegisterBook`, {
      params,
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

const updateRegisterNotebook = async (accessToken, slotData) => {
  try {
    const res = await axios.put(`${API_HOST}/RegisterBook`, slotData, {
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
export { getRegisterNotebook, updateRegisterNotebook };
