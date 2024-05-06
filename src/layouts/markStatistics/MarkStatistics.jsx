import { Card, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { BarChart, axisClasses } from "@mui/x-charts";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { studentClasses } from "mock/class";
import { schoolYears } from "mock/schoolYear";
import { subjects } from "mock/subject";
import React, { useState } from "react";

import "./style.scss";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TableComponent from "components/TableComponent/TableComponent";

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = ["Khối 10", "Khối 11", "Khối 12"];

const handleViewDetails = (student) => {
  console.log("View details for student:", student);
  // Implement your logic to view details
};

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    Toán: 2.1,
    Lớp: "12A1",
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    Toán: 2.8,
    Lớp: "12A2",
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    Toán: 4.1,
    Lớp: "12A3",
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    Toán: 7.3,
    Lớp: "12A4",
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    Toán: 9.9,
    Lớp: "12A5",
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    Toán: 1.2,
    Lớp: "12A6",
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    Toán: 3.1,
    Lớp: "12A7",
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    Toán: 4.9,
    Lớp: "12A8",
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    Toán: 1.3,
    Lớp: "12A9",
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    Toán: 5.5,
    Lớp: "12A10",
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    Toán: 6.5,
    Lớp: "12A11",
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    Toán: 10,
    Lớp: "12A12",
  },
];

const dataset1 = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    Toán: 9,
    Khối: "10",
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    Toán: 2.8,
    Khối: "11",
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    Toán: 4.1,
    Khối: "12",
  },
];

const valueFormatter = (value) => {
  if (typeof value === "number" || value === null) {
    return `${value} điểm`;
  }
  throw new Error("Value must be a number or null");
};

const chartSetting = {
  yAxis: [
    {
      label: "Điểm",
    },
  ],
  series: [{ dataKey: "Toán", label: "Trung bình môn", valueFormatter, color: "#247CD4" }],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function MarkStatistics() {
  const [aSubjectForAGrade, setASubjectForAGrade] = useState([
    ["12A1", "10.0", "1"],
    ["12A2", "10.0", "3"],
    ["12A3", "10.0", "2"],
    ["12A4", "10.0", "5"],
    ["12A5", "10.0", "4"],
    ["12A6", "10.0", "1"],
    ["12A7", "10.0", "1"],
    ["12A8", "10.0", "1"],
    ["12A9", "10.0", "1"],
    ["12A10", "10.0", "1"],
    ["12A11", "10.0", "1"],
    ["12A12", "10.0", "1"],
  ]);

  const [aSubjectForEntireSchool, setASubjectForEntireSchool] = useState([
    ["Khối 10", "500", "9", "1"],
    ["Khối 11", "500", "9", "2"],
    ["Khối 12", "500", "9", "3"],
  ]);

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

  const handleDetails = (rowItem) => {
    console.log("Details row:", rowItem);
    // Implement delete logic here
  };

  (React.useState < "middle") | ("tick" > "middle");
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
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

          <>
            <div className="text-center mt-5">
              <h4 className="text-xl font-bold">Thống kê điểm Toán khối 12</h4>
              <h4 className="text-xl font-bold">Học kỳ: HKI. Năm học: 2023-2024</h4>
            </div>

            <div className="flex  mt-4">
              <div className="w-4/5 p-3 rounded-md shadow-md" style={{ background: "#E9F7FF" }}>
                <BarChart
                  dataset={dataset}
                  xAxis={[{ scaleType: "band", dataKey: "Lớp", tickPlacement, tickLabelPlacement }]}
                  {...chartSetting}
                />
              </div>
              <div className="w-1/5 ml-3 mt-4 custom">
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Điểm trung bình"
                  count="6.75"
                  percentage={{
                    color: "success",
                    amount: "12A1",
                    label: "có TB cao nhất",
                  }}
                />
              </div>
            </div>

            <div className="mt-5 custom-table">
              <TableComponent
                header={["Lớp", "Điểm TB", "Hạng"]}
                data={aSubjectForAGrade}
                // onEdit={handleEdit}
                onDetails={handleDetails}
                // onDelete={handleDelete}
                className="mt-4"
              />
            </div>
          </>

          <>
            <div className="text-center mt-5">
              <h4 className="text-xl font-bold">Thống kê điểm Toán trường THPT Nguyễn Việt Hồng</h4>
              <h4 className="text-xl font-bold">Học kỳ: HKI. Năm học: 2023-2024</h4>
            </div>

            <div className="flex mt-4">
              <div className="w-2/5 p-3 rounded-md shadow-md" style={{ background: "#E9F7FF" }}>
                <BarChart
                  dataset={dataset1}
                  xAxis={[
                    { scaleType: "band", dataKey: "Khối", tickPlacement, tickLabelPlacement },
                  ]}
                  {...chartSetting}
                />
              </div>
              <div className="w-3/5">
                <div className="w-4/12 ml-3 mt-4 custom">
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="Điểm trung bình"
                    count="8.75"
                    percentage={{
                      color: "success",
                      amount: "Khối 12",
                      label: "có TB cao nhất",
                    }}
                  />
                </div>
                <div className="w-full ml-3 table">
                  <TableComponent
                    header={["Khối", "Số lượng", "Điểm", "Hạng"]}
                    data={aSubjectForEntireSchool}
                    // onEdit={handleEdit}
                    onDetails={handleDetails}
                    // onDelete={handleDelete}
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          </>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
