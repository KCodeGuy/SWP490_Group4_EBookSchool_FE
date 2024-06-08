import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAllClasses = async (accessToken) => {
  const res = await axios.get(`${API_HOST}/Classes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};
// CallAPI_ClassManagement_UolLT_V1
const getClassByID = async (accessToken, classID) => {
  const res = await axios.get(`${API_HOST}/Classes/${classID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return res.data;
};

const addClass = async (accessToken, classData) => {
  try {
    const response = await axios.post(`${API_HOST}/Classes`, classData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding class:", error);
    throw error;
  }
};

const updateClass = async (accessToken, classData) => {
  // console.log(classData);
  try {
    const res = await axios.put(`${API_HOST}/Classes/${classData.id}`, classData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

const deleteClass = async (accessToken, classID) => {
  try {
    const res = await axios.delete(`${API_HOST}/Classes/${classID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

export { getAllClasses, getClassByID, addClass, updateClass, deleteClass };
