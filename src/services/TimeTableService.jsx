// src/api.js
import axios from "axios";

export const getStudentTimetable = async (studentID, schoolYear, fromDate, accessToken) => {
  const response = await axios.get("http://localhost:1000/api/Schedules/Student", {
    params: {
      studentID,
      schoolYear,
      fromDate,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken}`,
    },
  });
  return response.data;
};
