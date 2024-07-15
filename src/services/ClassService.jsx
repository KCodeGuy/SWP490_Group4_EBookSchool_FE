import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllClasses = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Classes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};
// CallAPI_ClassManagement_UolLT_V1
const getClassByID = async (accessToken, classID) => {
  console.log(classID);
  const res = await axios.get(`${API_HOST}/Classes/${classID}?schoolYear=2024-2025`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(res.data);
  return res.data;
};

const addClass = async (accessToken, classData) => {
  try {
    const response = await axios.post(`${API_HOST}/Classes`, classData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const updateClass = async (accessToken, classData) => {
  try {
    const res = await axios.put(`${API_HOST}/Classes?classID=${classData.id}`, classData, {
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

const deleteClass = async (accessToken, classID) => {
  try {
    const res = await axios.delete(`${API_HOST}/Classes/${classID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

const downloadTemplateClass = () => {
  window.location.href = `https://orbapi.click/Templates/template_class.xlsx`;
};

const addClassByExcel = async (accessToken, file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(`${API_HOST}/Classes/Excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw error;
  }
};
export {
  getAllClasses,
  getClassByID,
  addClass,
  updateClass,
  deleteClass,
  downloadTemplateClass,
  addClassByExcel,
};
