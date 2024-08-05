import axios from "axios";
import { API_HOST } from "./APIConfig";

const getMarkOfAllStudentsBySubject = async (accessToken, schoolYear, className, subjectName) => {
  try {
    let params = {
      className,
      subjectName,
      schoolYear,
    };
    const res = await axios.get(`${API_HOST}/Scores/ByClassBySubject`, {
      params,
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

const getMarkOfStudentBySubject = async (accessToken, studentID, schoolYear, subjectName) => {
  try {
    let params = {
      studentID,
      subject: subjectName,
      schoolYear,
    };
    const res = await axios.get(`${API_HOST}/Scores/ByStudentBySubject`, {
      params,
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

const getMarkOfStudentAllSubject = async (accessToken, studentID, schoolYear) => {
  try {
    let params = {
      studentID,
      schoolYear,
    };
    const res = await axios.get(`${API_HOST}/Scores/AVGByStudentAllSubject`, {
      params,
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

const getMarkOfClassAllSubjects = async (accessToken, schoolYear, className) => {
  try {
    let params = {
      className,
      schoolYear,
    };
    const res = await axios.get(`${API_HOST}/Scores/ByClassAllSubject`, {
      params,
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
const downloadTemplateMarkByMarkComponent = async ({
  className,
  schoolYear,
  semester,
  subjectName,
  component,
  indexCol,
}) => {
  window.location.href = `${API_HOST}/Scores/Template?className=${className}&schoolYear=${schoolYear}&semester=${semester}&subjectName=${subjectName}&component=${component}&indexCol=${indexCol}`;
};

const updateMarkByMarkComponent = async (accessToken, file) => {
  const formData = new FormData();
  formData.append("File", file);
  try {
    const res = await axios.put(`${API_HOST}/Scores/Excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export {
  getMarkOfStudentBySubject,
  getMarkOfAllStudentsBySubject,
  downloadTemplateMarkByMarkComponent,
  updateMarkByMarkComponent,
  getMarkOfClassAllSubjects,
  getMarkOfStudentAllSubject,
};
