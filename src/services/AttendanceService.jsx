import axios from "axios";
import { API_HOST } from "./APIConfig";

const getAttendanceBySlot = async (accessToken, slotID) => {
  // console.log(slotID);
  const res = await axios.get(`${API_HOST}/Attendance/GetAttendanceBySlot/${slotID}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // console.log(res.data);
  return res.data;
};

const updateAttendance = async (accessToken, attendanceData) => {
  try {
    const res = await axios.put(`${API_HOST}/Attendance`, attendanceData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

export { getAttendanceBySlot, updateAttendance };
