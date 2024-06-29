import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllTeachers = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Teachers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
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

const createTeacher = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("username", data.otherValues.username);
  formData.append("fullName", data.otherValues.fullName);
  formData.append("birthday", data.otherValues.birthday);
  formData.append("gender", data.otherValues.gender);
  formData.append("nation", data.otherValues.nation);
  formData.append("email", data.otherValues.email);
  formData.append("phone", data.otherValues.phone);
  formData.append("isBachelor", data.otherValues.bachelor ?? false);
  formData.append("isMaster", data.otherValues.master ?? false);
  formData.append("isDoctor", data.otherValues.doctor ?? false);
  formData.append("isProfessor", data.otherValues.professor ?? false);
  formData.append("address", data.otherValues.address);
  formData.append("Password", data.otherValues.password);
  formData.append("avatar", data.otherValues.avatar);

  if (data.permissions && Array.isArray(data.permissions)) {
    data.permissions.forEach((permission, index) => {
      formData.append(`Permissions[${index}]`, permission);
    });
  }

  if (data.roles && Array.isArray(data.roles)) {
    data.roles.forEach((role, index) => {
      formData.append(`Roles[${index}]`, role);
    });
  }

  try {
    const res = await axios.post(`${API_HOST}/Teachers`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const updateTeacher = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("username", data.otherValues.username);
  formData.append("fullName", data.otherValues.fullName);
  formData.append("birthday", data.otherValues.birthday);
  formData.append("gender", data.otherValues.gender);
  formData.append("nation", data.otherValues.nation);
  formData.append("email", data.otherValues.email);
  formData.append("phone", data.otherValues.phone);
  formData.append("isBachelor", data.otherValues.bachelor ?? false);
  formData.append("isMaster", data.otherValues.master ?? false);
  formData.append("isDoctor", data.otherValues.doctor ?? false);
  formData.append("isProfessor", data.otherValues.professor ?? false);
  formData.append("address", data.otherValues.address);
  formData.append("Password", data.otherValues.password);
  formData.append("avatar", data.otherValues.avatar);

  if (data.permissions && Array.isArray(data.permissions)) {
    data.permissions.forEach((permission, index) => {
      formData.append(`Permissions[${index}]`, permission);
    });
  }

  if (data.roles && Array.isArray(data.roles)) {
    data.roles.forEach((role, index) => {
      formData.append(`Roles[${index}]`, role);
    });
  }

  try {
    const res = await axios.put(`${API_HOST}/Teachers/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteTeacher = async (accessToken, username) => {
  try {
    const res = await axios.delete(`${API_HOST}/Teachers/${username}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

const addTeacherByExcel = async (accessToken, file) => {
  const formData = new FormData();
  formData.append("File", file);
  try {
    const res = await axios.post(`${API_HOST}/Teachers/Excel`, formData, {
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

const handleDownloadTeacherExcel = () => {
  window.location.href = `${ORB_HOST}/Templates/template_teacher.xlsx`;
};

export {
  getTeacherByID,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  createTeacher,
  addTeacherByExcel,
  handleDownloadTeacherExcel,
};
