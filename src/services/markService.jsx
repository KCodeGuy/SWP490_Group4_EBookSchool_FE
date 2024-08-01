import axios from "axios";
import { API_HOST } from "./APIConfig";

const getMarkOfAllStudentsBySubject = async (accessToken, schoolYear, className, subjectName) => {
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
};

const getMarkOfClassAllSubjects = async (accessToken, schoolYear, className) => {
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
  getMarkOfAllStudentsBySubject,
  downloadTemplateMarkByMarkComponent,
  updateMarkByMarkComponent,
  getMarkOfClassAllSubjects,
};
