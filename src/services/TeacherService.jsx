import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllTeachers = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Teachers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(res.data);
  return res.data;
};

const getTeacherByID = async (accessToken, teacherID) => {
  const res = await axios.get(`${API_HOST}/Teachers/${teacherID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

export { getTeacherByID, getAllTeachers };
