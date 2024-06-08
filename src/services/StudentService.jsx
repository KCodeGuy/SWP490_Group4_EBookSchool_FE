import axios from "axios";
import { API_HOST } from "./APIConfig";

const getStudentByID = async (accessToken, studentID) => {
  const res = await axios.get(`${API_HOST}/Students/${studentID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
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

  try {
    const res = await axios.put(`${API_HOST}/Students/${data.id}`, formData, {
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

export { getStudentByID, updateStudent };
