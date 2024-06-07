import axios from "axios";
import { API_HOST } from "./APIConfig";

const getStudentByID = async (accessToken, studentID) => {
  const res = await axios.get(`${API_HOST}/Students/${studentID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};

export { getStudentByID };
