import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllTeachers = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Teachers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};

const getTeacherByID = async (accessToken, id) => {
  const res = await axios.get(`${API_HOST}/Teachers/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};

export { getAllTeachers, getTeacherByID };
