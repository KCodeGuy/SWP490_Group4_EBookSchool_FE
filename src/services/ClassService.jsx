import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllClasses = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Classes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};

export { getAllClasses };
