import axios from "axios";
import { API_HOST, ORB_HOST } from "./APIConfig";

const getAllSubjects = async (accessToken) => {
  try {
    const res = await axios.get(`${API_HOST}/Subjects`, {
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

const getSubjectByID = async (accessToken, subjectID) => {
  try {
    const res = await axios.get(`${API_HOST}/Subjects/${subjectID}`, {
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

const addSubject = async (accessToken, subjectData) => {
  try {
    const response = await axios.post(`${API_HOST}/Subjects`, subjectData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    return error;
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

    return res;
  } catch (error) {
    return error;
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
    return res;
  } catch (error) {
    return error;
  }
};

const downloadTemplateSubject = () => {
  window.location.href = `https://orbapi.click/Templates/template_subject.xlsx`;
};

const addSubjectByExcel = async (accessToken, file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(`${API_HOST}/Subjects/Excel`, formData, {
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
  getAllSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  downloadTemplateSubject,
  addSubjectByExcel,
  getSubjectByID,
};
