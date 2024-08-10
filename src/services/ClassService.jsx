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
const getClassByID = async (accessToken, classID, schoolYear) => {
  try {
    const res = await axios.get(`${API_HOST}/Classes/${classID}?schoolYear=${schoolYear}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

const addClass = async (accessToken, classData) => {
  try {
    const res = await axios.post(`${API_HOST}/Classes`, classData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (error) {
    return error;
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
    return res;
  } catch (error) {
    return error;
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
    return res;
  } catch (error) {
    return error;
  }
};

const downloadTemplateClass = () => {
  window.location.href = `https://orbapi.click/Templates/template_class.xlsx`;
};

const downloadTemplateClassByQuery = (className, schoolYear) => {
  window.location.href = `https://orbapi.click/api/Classes/GetExcel?className=${className}&schoolYear=${schoolYear}`;
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
    return res;
  } catch (error) {
    return error;
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
  downloadTemplateClassByQuery,
};
