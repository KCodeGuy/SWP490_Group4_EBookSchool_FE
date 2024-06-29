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
  } else if (userRole === "Principal") {
    apiURL = `${API_HOST}/Schedules/Class`;
    params = {
      className: classID,
      schoolYear,
      fromDate,
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
  const formData = new FormData();
  formData.append("File", file);
  try {
    const res = await axios.post(`${API_HOST}/Schedules/Excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw error;
  }
};

export const addTimeTableManually = async (accessToken, slotData) => {
  try {
    const res = await axios.post(`${API_HOST}/Schedules`, slotData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log("Add slot: ", res.data);
    return res.data;
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw error;
  }
};

export const updateSlotOfTimeTable = async (accessToken, slotData) => {
  try {
    const res = await axios.put(`${API_HOST}/Schedules/${slotData.id}`, slotData, {
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

export const deleteSlotOfTimeTable = async (accessToken, slotID) => {
  try {
    const res = await axios.delete(`${API_HOST}/Schedules/${slotID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting timetable:", error);
    throw error;
  }
};
