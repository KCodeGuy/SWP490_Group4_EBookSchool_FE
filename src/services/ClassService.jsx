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
  const res = await axios.get(`${API_HOST}/Classes/${classID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

// const addClass = async (accessToken, data) => {
//   const formData = new FormData();
//   formData.append("classroom", data.classroom);
//   formData.append("schoolYear", data.schoolYear);
//   formData.append("teacher", data.teacherID);
//   try {
//     const res = await axios.post(`${API_HOST}/Classes`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `${accessToken}`,
//       },
//     });

//     return res.data;
//   } catch (error) {
//     console.error("Error adding class:", error);
//     throw error;
//   }
// };
const addClass = async (accessToken, data) => {
  try {
    const res = await axios.post(`${API_HOST}/Classes`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error adding class:", error);
    throw error;
  }
};

const updateClass = async (accessToken, data) => {
  const formData = new FormData();
  formData.append("classroom", data.classroom);

  try {
    const res = await axios.put(`${API_HOST}/Classes/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

export { getAllClasses, getClassByID, addClass, updateClass, deleteClass };
