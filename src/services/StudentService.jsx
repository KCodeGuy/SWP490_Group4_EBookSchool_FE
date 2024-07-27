import axios from "axios";
import { API_HOST, ORB_HOST } from "./APIConfig";

const getStudentByID = async (accessToken, studentID) => {
  const res = await axios.get(`${API_HOST}/Students/${studentID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const getAllStudents = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Students`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const addStudentByExcel = async (accessToken, file) => {
  const formData = new FormData();
  formData.append("File", file);
  try {
    const res = await axios.post(`${API_HOST}/Students/Excel`, formData, {
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

const handleDownloadStudentExcel = () => {
  window.location.href = `${ORB_HOST}/Templates/template_student.xlsx`;
};

const updateStudent = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("birthday", data.birthday);
  formData.append("birthplace", data.birthplace);
  formData.append("gender", data.gender);
  formData.append("nation", data.nation);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("fatherFullName", data.fatherFullName);
  formData.append("fatherPhone", data.fatherPhone);
  formData.append("fatherProfession", data.fatherProfession);
  formData.append("motherFullName", data.motherFullName);
  formData.append("motherPhone", data.motherPhone);
  formData.append("motherProfession", data.motherProfession);
  formData.append("address", data.address);
  formData.append("avatar", data.avatar);
  if (data?.password) {
    formData.append("password", data.password);
  }

  try {
    const res = await axios.put(`${API_HOST}/Students/${data.id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

const createStudent = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("birthday", data.birthday);
  formData.append("birthplace", data.birthplace);
  formData.append("gender", data.gender);
  formData.append("nation", data.nation);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("fatherFullName", data.fatherFullName);
  formData.append("fatherPhone", data.fatherPhone);
  formData.append("fatherProfession", data.fatherProfession);
  formData.append("motherFullName", data.motherFullName);
  formData.append("motherPhone", data.motherPhone);
  formData.append("motherProfession", data.motherProfession);
  formData.append("address", data.address);
  formData.append("avatar", data.avatar);

  try {
    const res = await axios.post(`${API_HOST}/Students`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

const deleteStudent = async (accessToken, username) => {
  try {
    const res = await axios.delete(`${API_HOST}/Students/${username}`, {
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

export {
  getStudentByID,
  updateStudent,
  getAllStudents,
  createStudent,
  deleteStudent,
  addStudentByExcel,
  handleDownloadStudentExcel,
};
