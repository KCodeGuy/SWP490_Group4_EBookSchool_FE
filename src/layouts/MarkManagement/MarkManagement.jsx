import MenuIcon from "@mui/icons-material/Menu";
import { FormControl, InputLabel, Card, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { studentClasses } from "mock/class";
import { schoolYears } from "mock/schoolYear";
import { subjects } from "mock/subject";
import React, { useState, useEffect, useRef } from "react";
import TableMarkAllStudentsComponent from "../../components/TableMarkAllStudentsComponent/TableMarkAllStudentsComponent";
import "./style.scss";
// Mark management (HieuTTN)

const scoreByStudents = {
  code: 200,
  status: true,
  message: "ok",
  data: [
    {
      id: 1,
      fullName: "Nguyễn Lê Văn A",
      average: 10,
      study: "Giỏi",
      conduct: "Tốt",
      rank: 1,
      scores: [
        { key: "Toán", value: 10 },
        { key: "Vật lí", value: 10 },
        { key: "Hóa học", value: 10 },
        { key: "Sinh học", value: 10 },
        { key: "Tin học", value: 10 },
        { key: "Ngữ Văn", value: 10 },
        { key: "Lịch Sử", value: 10 },
        { key: "Địa lí", value: 10 },
        { key: "Ngoại ngữ", value: 10 },
        { key: "Công nghệ", value: 10 },
        { key: "GDCD", value: 10 },
        { key: "GDQP", value: 10 },
        { key: "Thể dục", value: 10 },
      ],
    },
    {
      id: 2,
      fullName: "Nguyễn Lê Văn A",
      average: 10,
      study: "Giỏi",
      conduct: "Tốt",
      rank: 1,
      scores: [
        { key: "Toán", value: 10 },
        { key: "Vật lí", value: 10 },
        { key: "Hóa học", value: 10 },
        { key: "Sinh học", value: 10 },
        { key: "Tin học", value: 10 },
        { key: "Ngữ Văn", value: 10 },
        { key: "Lịch Sử", value: 10 },
        { key: "Địa lí", value: 10 },
        { key: "Ngoại ngữ", value: 10 },
        { key: "Công nghệ", value: 10 },
        { key: "GDCD", value: 10 },
        { key: "GDQP", value: 10 },
        { key: "Thể dục", value: 10 },
      ],
    },
    {
      id: 3,
      fullName: "Nguyễn Lê Văn A",
      average: 10,
      study: "Giỏi",
      conduct: "Tốt",
      rank: 1,
      scores: [
        { key: "Toán", value: 10 },
        { key: "Vật lí", value: 10 },
        { key: "Hóa học", value: 10 },
        { key: "Sinh học", value: 10 },
        { key: "Tin học", value: 10 },
        { key: "Ngữ Văn", value: 10 },
        { key: "Lịch Sử", value: 10 },
        { key: "Địa lí", value: 10 },
        { key: "Ngoại ngữ", value: 10 },
        { key: "Công nghệ", value: 10 },
        { key: "GDCD", value: 10 },
        { key: "GDQP", value: 10 },
        { key: "Thể dục", value: 10 },
      ],
    },
    // Additional student data...
  ],
};

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = ["Khối 10", "Khối 11", "Khối 12"];

const handleViewDetails = (student) => {
  console.log("View details for student:", student);
  // Implement your logic to view details
};

export default function MarkManagement() {
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [schoolSemester, setSchoolSemester] = React.useState(semesters[0]);
  const handleSchoolSemesterSelectedChange = (event) => {
    setSchoolSemester(event.target.value);
  };

  const [grade, setGrade] = React.useState(grades[0]);
  const handleGradeSelectedChange = (event) => {
    setGrade(event.target.value);
  };

  const [schoolClass, setSchoolClass] = React.useState(studentClasses.data[0].name);
  const handleSchoolClassSelectedChange = (event) => {
    setSchoolClass(event.target.value);
  };

  const [schoolSubject, setSchoolSubject] = React.useState("Môn học");
  const handleSchoolSubjectSelectedChange = (event) => {
    setSchoolSubject(event.target.value);
  };

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          {/* <InputLabel id="demo-simple-select-label">Năm học</InputLabel> */}

          <div className="flex flex-nowrap justify-between mb-2.5">
            <div className="left">
              <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
                <InputLabel id="select-school-year-lable" className="ml-3">
                  Năm học
                </InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-10 mx-3"
                  label="Năm học"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {schoolYears.data.map((item) => (
                    <MenuItem key={item.schoolYear} value={item.schoolYear}>
                      {item.schoolYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
                <InputLabel id="select-semester-lable" className="ml-3">
                  Học kì
                </InputLabel>
                <Select
                  labelId="select-semester-lable"
                  id="select-semester"
                  value={schoolSemester}
                  className="h-10 mx-3"
                  label="Học kì"
                  onChange={handleSchoolSemesterSelectedChange}
                >
                  {semesters.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
                <InputLabel id="select-grade-lable" className="ml-3">
                  Khối
                </InputLabel>
                <Select
                  labelId="select-grade-lable"
                  id="select-grade"
                  value={grade}
                  className="h-10 mx-3"
                  label="Khối"
                  onChange={handleGradeSelectedChange}
                >
                  {grades.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
                <InputLabel id="select-school-class-lable" className="ml-3">
                  Lớp
                </InputLabel>
                <Select
                  labelId="select-school-class-lable"
                  id="select-school-class"
                  value={schoolClass}
                  className="h-10 mx-3"
                  label="Lớp"
                  onChange={handleSchoolClassSelectedChange}
                >
                  {studentClasses.data.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
                <InputLabel id="select-school-subject-lable" className="ml-3">
                  Môn học
                </InputLabel>
                <Select
                  labelId="select-school-subject-lable"
                  id="select-school-subject"
                  value={schoolSubject}
                  className="h-10 mx-3"
                  label="Môn học"
                  onChange={handleSchoolSubjectSelectedChange}
                >
                  <MenuItem key="Môn học" value="Môn học">
                    Môn học
                  </MenuItem>
                  {subjects.data.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div
              ref={popupRef}
              className="right rounded flex justify-center items-center w-10"
              onClick={togglePopup}
            >
              <MenuIcon className="icon" />
            </div>
          </div>
          {showPopup && (
            <div className="absolute right-10 bg-white shadow-xl rounded z-50 cursor-pointer">
              <ul className="list-none m-0 p-0">
                <li
                  className="text-center font-bold py-2 px-4 hover"
                  onClick={() => console.log("Nhập điểm")}
                >
                  Nhập điểm
                </li>
                <li
                  className="text-center font-bold py-2 px-4 hover"
                  onClick={() => console.log("Nhập điểm bằng Excel")}
                >
                  Nhập điểm bằng Excel
                </li>
                <li
                  className="text-center font-bold py-2 px-4 hover"
                  onClick={() => console.log(" Sửa điểm")}
                >
                  Sửa điểm
                </li>
                <li
                  className="text-center font-bold py-2 px-4 hover"
                  onClick={() => console.log(" Sửa điểm bằng Excel")}
                >
                  Sửa điểm bằng Excel
                </li>
              </ul>
            </div>
          )}

          <div className="text-center mt-5">
            <h4 className="text-xl font-bold">Bảng điểm tổng kết lớp 12A1</h4>
            <h4 className="text-xl font-bold">Học kỳ: HKI. Năm học: 2023-2024</h4>
          </div>
          <div className="overflow-scroll">
            <TableMarkAllStudentsComponent
              className="mt-4"
              data={scoreByStudents.data}
              onViewDetails={handleViewDetails}
            />
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}