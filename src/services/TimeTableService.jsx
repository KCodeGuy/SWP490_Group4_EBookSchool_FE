import axios from "axios";
import { API_HOST } from "./APIConfig";

export const getTimetable = async (
  userID,
  schoolYear,
  fromDate,
  accessToken,
  userRole,
  classID
) => {
  let params = {
    studentID: userID,
    schoolYear,
    fromDate,
  };
  let apiURL = `${API_HOST}/Schedules/Student`;

  if (userRole === "SubjectTeacher") {
    apiURL = `${API_HOST}/Schedules/SubjectTeacher`;
    params = {
      teacherID: userID,
      schoolYear,
      fromDate,
    };
  } else if (userRole === "HomeroomTeacher") {
    apiURL = `${API_HOST}/Schedules/HomeroomTeacher`;
    params = {
      teacherID: userID,
      schoolYear,
      fromDate,
      classname: classID,
    };
  }
  const response = await axios.get(apiURL, {
    params,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const addTimeTableByExcel = async (accessToken, file) => {
  console.log(file);
  console.log(accessToken);

  const formData = new FormData();
  formData.append("File", file);
  try {
    const res = await axios.post(`${API_HOST}/Schedules/Excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
};

export const addTimeTableManually = async (accessToken, slotData) => {
  console.log(slotData);
  try {
    const res = await axios.post(`${API_HOST}/Schedules`, slotData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
};
