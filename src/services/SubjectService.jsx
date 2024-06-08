import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllSubjects = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Subjects`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const deleteSubject = async (accessToken, subjectID) => {
  try {
    const res = await axios.delete(`${API_HOST}/Subjects/${subjectID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }
};

export { getAllSubjects, deleteSubject };
