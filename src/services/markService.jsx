import axios from "axios";
import { API_HOST } from "./APIConfig";

const getMarkOfAllStudentsBySubject = async (accessToken, schoolYear, className, subjectName) => {
  let params = {
    className,
    subjectName,
    schoolYear,
  };

  console.log(accessToken);
  console.log(params);
  const res = await axios.get(`${API_HOST}/Scores/ByClassBySubject`, {
    params,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(res.data);
  return res.data;
};

const downloadTemplateMarkByMarkComponent = async ({
  className,
  schoolYear,
  semester,
  subjectName,
  component,
  indexCol = 3,
}) => {
  console.log(indexCol);
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
    return res.data;
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw error;
  }
};

export {
  getMarkOfAllStudentsBySubject,
  downloadTemplateMarkByMarkComponent,
  updateMarkByMarkComponent,
};
