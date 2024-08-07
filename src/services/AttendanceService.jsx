import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAttendanceBySlot = async (accessToken, slotID) => {
  try {
    const res = await axios.get(`${API_HOST}/Attendance/GetAttendanceBySlot/${slotID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

const getAttendanceByStudentAllSubject = async (accessToken, studentID, schoolYear) => {
  try {
    const res = await axios.get(
      `${API_HOST}/Attendance/GetAttendanceByStudentAllSubject?studentID=${studentID}&schoolYear=${schoolYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

const getAttendanceByStudent = async (accessToken, studentID, schoolYear, subjectName) => {
  try {
    const res = await axios.get(
      `${API_HOST}/Attendance/GetAttendanceByStudent?studentID=${studentID}&schoolYear=${schoolYear}&subjectName=${subjectName}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

const updateAttendance = async (accessToken, attendanceData) => {
  try {
    const res = await axios.put(`${API_HOST}/Attendance`, attendanceData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

export {
  getAttendanceBySlot,
  updateAttendance,
  getAttendanceByStudentAllSubject,
  getAttendanceByStudent,
};
