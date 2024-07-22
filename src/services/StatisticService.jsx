import axios from "axios";
import { API_HOST } from "./APIConfig";

const statisticOfRegisterNotebook = async (accessToken, schoolYear, fromDate, toDate) => {
  const res = await axios.get(
    `${API_HOST}/Statistics/Schedule?fromDate=${fromDate}&toDate=${toDate}&schoolYear=${schoolYear}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const statisticOfRegisterNotebookWholeYear = async (accessToken, schoolYear) => {
  const res = await axios.get(`${API_HOST}/Statistics/Schedule?schoolYear=${schoolYear}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.data;
};

const statisticOfRegisterNotebookByGrade = async (
  accessToken,
  schoolYear,
  fromDate,
  toDate,
  grade
) => {
  const res = await axios.get(
    `${API_HOST}/Statistics/Schedule?fromDate=${fromDate}&toDate=${toDate}&schoolYear=${schoolYear}&grade=${grade}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const statisticOfRegisterNotebookByGradeWholeYear = async (accessToken, schoolYear, grade) => {
  const res = await axios.get(
    `${API_HOST}/Statistics/Schedule?schoolYear=${schoolYear}&grade=${grade}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const statisticOfAttendance = async (accessToken, schoolYear, fromDate, toDate, grade) => {
  const res = await axios.get(
    `${API_HOST}/Statistics/Attendance?fromDate=${fromDate}&toDate=${toDate}&schoolYear=${schoolYear}&grade=${grade}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};

const statisticOfAttendanceWholeYear = async (accessToken, schoolYear, grade) => {
  const res = await axios.get(
    `${API_HOST}/Statistics/Attendance?schoolYear=${schoolYear}&grade=${grade}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return res.data;
};
const statisticOfMark = async (accessToken, schoolYear, action, value) => {
  let url = `${API_HOST}/Statistics/GroupScore?schoolYear=${schoolYear}`;

  if (action === "schoolSubject") {
    url += `&schoolSubject=${value}`;
  } else if (action === "schoolGrade") {
    url += `&schoolGrade=${value}`;
  } else if (action === "schoolClass") {
    url += `&schoolClass=${value}`;
  }

  const res = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // console.log(url);
  return res.data;
};

export {
  statisticOfRegisterNotebook,
  statisticOfAttendance,
  statisticOfMark,
  statisticOfAttendanceWholeYear,
  statisticOfRegisterNotebookWholeYear,
  statisticOfRegisterNotebookByGradeWholeYear,
  statisticOfRegisterNotebookByGrade,
};
