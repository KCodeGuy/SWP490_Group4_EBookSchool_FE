import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllLogs = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Logs`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export { getAllLogs };
