import axios from "axios";
import { API_HOST } from "./APIConfig";

const statisticOfRegisterNotebook = async (accessToken, schoolYear, fromDate, toDate) => {
  try {
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
  } catch (error) {
    return error;
  }
};

const statisticOfRegisterNotebookWholeYear = async (accessToken, schoolYear) => {
  try {
    const res = await axios.get(`${API_HOST}/Statistics/Schedule?schoolYear=${schoolYear}`, {
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

const statisticOfRegisterNotebookByGrade = async (
  accessToken,
  schoolYear,
  fromDate,
  toDate,
  grade
) => {
  try {
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
  } catch (error) {
    return error;
  }
};

const statisticOfRegisterNotebookByGradeWholeYear = async (accessToken, schoolYear, grade) => {
  try {
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
  } catch (error) {
    return error;
  }
};

const statisticOfAttendance = async (accessToken, schoolYear, fromDate, toDate, grade) => {
  try {
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
  } catch (error) {
    return error;
  }
};

const statisticOfAttendanceWholeYear = async (accessToken, schoolYear, grade) => {
  try {
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
  } catch (error) {
    return error;
  }
};

const statisticOfAttendanceByClassBySubject = async (
  accessToken,
  schoolYear,
  className,
  subjectName
) => {
  try {
    const res = await axios.get(
      `${API_HOST}/Statistics/GetAttendanceByClassBySubject?schoolYear=${schoolYear}&className=${className}&subjectName=${subjectName}`,
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
const statisticOfMark = async (accessToken, schoolYear, action, value) => {
  try {
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
  } catch (error) {
    return error;
  }
};

const statisticOfAcademicPerformance = async (accessToken, schoolYear, action, value) => {
  try {
    let url = `${API_HOST}/Statistics/Academic?schoolYear=${schoolYear}`;

    if (action === "schoolSubject") {
      url += `&schoolSubject=${value}`;
    } else if (action === "schoolGrade") {
      url += `&grade=${value}`;
    } else if (action === "schoolClass") {
      url += `&className=${value}`;
    }

    const res = await axios.get(url, {
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
export {
  statisticOfAcademicPerformance,
  statisticOfRegisterNotebook,
  statisticOfAttendance,
  statisticOfMark,
  statisticOfAttendanceWholeYear,
  statisticOfRegisterNotebookWholeYear,
  statisticOfRegisterNotebookByGradeWholeYear,
  statisticOfRegisterNotebookByGrade,
  statisticOfAttendanceByClassBySubject,
};
