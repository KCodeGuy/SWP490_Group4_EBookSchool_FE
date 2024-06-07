import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllStudents = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Students`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};

const getStudentByID = async (accessToken, id) => {
  const res = await axios.get(`${API_HOST}/Students/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};

export { getAllStudents, getStudentByID };
