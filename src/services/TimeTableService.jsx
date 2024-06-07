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

export const addTimeTableByExcel = async (accessToken, scheduleFile) => {
  const formData = new FormData();
  formData.append("scheduleFile", scheduleFile);
  try {
    const res = await axios.post(`${API_HOST}/Schedules/Excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
};

export const downloadTemplateTimetable = async (fileName) => {
  try {
    const res = await axios.get(`${API_HOST}/Schedules/template_schedule.xlsx`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding notification:", error);
    throw error;
  }
};
