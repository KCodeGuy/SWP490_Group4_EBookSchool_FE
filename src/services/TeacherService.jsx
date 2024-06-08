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

const updateTeacher = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  formData.append("birthday", data.birthday);
  formData.append("gender", data.gender);
  formData.append("nation", data.nation);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("isBachelor", data.isBachelor);
  formData.append("isMaster", data.isMaster);
  formData.append("isDoctor", data.isDoctor);
  formData.append("isProfessor", data.isProfessor);
  formData.append("address", data.address);
  formData.append("Password", "");
  formData.append("avatar", data.avatar);

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

export { getTeacherByID, getAllTeachers, updateTeacher };
