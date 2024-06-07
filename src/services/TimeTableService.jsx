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
  console.log(response.data);
  return response.data;
};

export const getSubjectTeacherTimetable = async (teacherID, schoolYear, fromDate, accessToken) => {
  const response = await axios.get(`${API_HOST}/Schedules/SubjectTeacher`, {
    params: {
      teacherID,
      schoolYear,
      fromDate,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
