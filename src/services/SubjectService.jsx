import axios from "axios";
import { API_HOST } from "./APIConfig";

export const getAllSubjects = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Subjects`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};
