import axios from "axios";
import { API_HOST } from "./APIConfig";

export const getStudentTimetable = async (studentID, schoolYear, fromDate, accessToken) => {
  const response = await axios.get(`${API_HOST}/Schedules/Student`, {
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
