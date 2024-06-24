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

const addSubject = async (accessToken, subjectData) => {
  try {
    const response = await axios.post(`${API_HOST}/Subjects`, subjectData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};

const updateSubject = async (accessToken, subjectData) => {
  try {
    const res = await axios.put(`${API_HOST}/Subjects/${subjectData.id}`, subjectData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
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

export { getAllSubjects, addSubject, updateSubject, deleteSubject };
