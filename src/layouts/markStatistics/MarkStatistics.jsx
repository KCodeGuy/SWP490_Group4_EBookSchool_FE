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
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import "./style.scss";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TableComponent from "components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = ["Khối 10", "Khối 11", "Khối 12"];

const datasetASubjectForAGrade = [
  {
    Toán: 2.1,
    Lớp: "12A1",
  },
  {
    Toán: 2.8,
    Lớp: "12A2",
  },
  {
    Toán: 4.1,
    Lớp: "12A3",
  },
  {
    Toán: 7.3,
    Lớp: "12A4",
  },
  {
    Toán: 9.9,
    Lớp: "12A5",
  },
  {
    Toán: 1.2,
    Lớp: "12A6",
  },
  {
    Toán: 3.1,
    Lớp: "12A7",
  },
  {
    Toán: 4.9,
    Lớp: "12A8",
  },
  {
    Toán: 1.3,
    Lớp: "12A9",
  },
  {
    Toán: 5.5,
    Lớp: "12A10",
  },
  {
    Toán: 6.5,
    Lớp: "12A11",
  },
  {
    Toán: 10,
    Lớp: "12A12",
  },
];

const datasetASubjectForEntireSchool = [
  {
    Toán: 9,
    Khối: "10",
  },
  {
    Toán: 2.8,
    Khối: "11",
  },
  {
    Toán: 4.1,
    Khối: "12",
  },
];

const datasetDetailedMarksfForSubjectOfClass = [
  {
    LessThan1: 2,
    Điểm: ">0 và <=1",
  },
  {
    LessThan1: 2,
    Điểm: ">1 và <=2",
  },
  {
    LessThan1: 4,
    Điểm: ">2 và <=3",
  },
  {
    LessThan1: 5,
    Điểm: ">3 và <=4",
  },
  {
    LessThan1: 6,
    Điểm: ">4 và <=5",
  },
  {
    LessThan1: 10,
    Điểm: ">5 và <=6",
  },
  {
    LessThan1: 8,
    Điểm: ">6 và <=7",
  },
  {
    LessThan1: 6,
    Điểm: ">7 và <=8",
  },
  {
    LessThan1: 5,
    Điểm: ">8 và <=9",
  },
  {
    LessThan1: 4,
    Điểm: ">9 và <=10",
  },
];

const valueFormatter = (value) => {
  if (typeof value === "number" || value === null) {
    return `${value} điểm`;
  }
  throw new Error("Value must be a number or null");
};

const chartASubjectForAGrade = {
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

const chartDetailedMarksfForSubjectOfClass = {
  yAxis: [
    {
      label: "Điểm",
    },
  ],
  series: [{ dataKey: "LessThan1", label: "Trung bình môn", valueFormatter, color: "#247CD4" }],
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

  const [detailedMarksfForSubjectOfClass, setDetailedMarksfForSubjectOfClass] = useState([
    ["Lê Văn A", "CE161025", "9", "1"],
    ["Lê Văn B", "CE161025", "8", "2"],
    ["Lê Văn C", "CE161025", "7", "3"],
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

  const handleStatistic = () => {
    console.log("Call api: ", { schoolYear, schoolSemester, grade, schoolSubject });
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
            <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
              <InputLabel id="select-school-year-lable">Năm học</InputLabel>
              <Select
                labelId="select-school-year-lable"
                id="elect-school-year"
                value={schoolYear}
                className="h-11 mr-3"
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
            <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
              <InputLabel id="select-semester-lable">Học kì</InputLabel>
              <Select
                labelId="select-semester-lable"
                id="select-semester"
                value={schoolSemester}
                className="h-11 mr-3"
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
            <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
              <InputLabel id="select-grade-lable">Khối</InputLabel>
              <Select
                labelId="select-grade-lable"
                id="select-grade"
                value={grade}
                className="h-11 mr-3"
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

            <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
              <InputLabel id="select-school-subject-lable">Môn học</InputLabel>
              <Select
                labelId="select-school-subject-lable"
                id="select-school-subject"
                value={schoolSubject}
                className="h-11 mr-3"
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
            <ButtonComponent
              type="success"
              className="max-[639px]:w-full"
              onClick={handleStatistic}
            >
              <FilterAltIcon className="mr-1" /> Thống kế
            </ButtonComponent>
          </div>

          <>
            <div className="text-center mt-6">
              <h4 className="text-xl font-bold">
                Thống kê điểm {schoolSubject} khối {grade}
              </h4>
              <h4 className="text-xl font-bold">
                Học kỳ: {schoolSemester}. Năm học: {schoolYear}
              </h4>
            </div>
            <h4 className="text-xl font-bold mt-5">Giáo viên: Lê Văn A</h4>
            <div className="w-full custom mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <ComplexStatisticsCard
                color="primary"
                icon="leaderboard"
                title="Điểm thấp nhất"
                count="4.95"
                percentage={{
                  color: "primary",
                  amount: "12A1",
                  label: "có điểm TB thấp nhất",
                }}
              />
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Điểm trung bình"
                count="6.75"
                percentage={{
                  color: "info",
                  amount: "Điểm trung bình giữa các lớp",
                  label: "",
                }}
              />
              <ComplexStatisticsCard
                color="success"
                icon="leaderboard"
                title="Điểm cao nhất"
                count="10"
                percentage={{
                  color: "success",
                  amount: "12A2",
                  label: "có TB cao nhất",
                }}
              />
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Tổng số lớp"
                count="12 lớp"
                percentage={{
                  color: "info",
                  amount: "12",
                  label: "là tổng số lớp lượng lớp",
                }}
              />
            </div>
            <div
              className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
              style={{ background: "#E9F7FF" }}
            >
              <BarChart
                dataset={datasetASubjectForAGrade}
                xAxis={[{ scaleType: "band", dataKey: "Lớp", tickPlacement, tickLabelPlacement }]}
                {...chartASubjectForAGrade}
              />
            </div>

            <div className="mt-8 custom-table">
              <p className="text-base font-bold">THỐNG KÊ CHI TIẾT ({schoolSubject})</p>
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
            <div className="text-center mt-8">
              <h4 className="text-xl font-bold">
                Thống kê điểm {schoolSubject} trường THPT Nguyễn Việt Hồng
              </h4>
              <h4 className="text-xl font-bold">
                Học kỳ: {schoolSemester}. Năm học: {schoolYear}
              </h4>
            </div>

            <div className="mt-4 w-full grid gap-4 sm:grid-cols-1 md:grid-cols-2 overflow-x-scroll">
              <div
                className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                style={{ background: "#E9F7FF" }}
              >
                <BarChart
                  dataset={datasetASubjectForEntireSchool}
                  xAxis={[
                    { scaleType: "band", dataKey: "Khối", tickPlacement, tickLabelPlacement },
                  ]}
                  {...chartASubjectForAGrade}
                />
              </div>
              <div className="w-full">
                <div className="mt-8 grid gap-2 sm:grid-cols-1 md:grid-cols-3 custom">
                  <ComplexStatisticsCard
                    color="primary"
                    icon="leaderboard"
                    title="Điểm trung bình"
                    count="8.75"
                    percentage={{
                      color: "primary",
                      amount: "Khối 12",
                      label: "có TB cao nhất",
                    }}
                  />
                  <ComplexStatisticsCard
                    icon="leaderboard"
                    title="Điểm trung bình"
                    count="8.75"
                    percentage={{
                      color: "info",
                      amount: "Khối 12",
                      label: "có TB cao nhất",
                    }}
                  />
                  <ComplexStatisticsCard
                    color="success"
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
                <div className="table w-full mt-8">
                  <p className="text-base font-bold">THỐNG KÊ CHI TIẾT (HK1, 2023)</p>
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

          <>
            <div className="text-center mt-8">
              <h4 className="text-xl font-bold">
                Thống kê chi tiết điểm {schoolSubject} lớp {schoolClass}
              </h4>
              <h4 className="text-xl font-bold">
                Học kỳ: {schoolSemester}. Năm học: {schoolYear}
              </h4>
            </div>
            <div className="mt-5">
              <h4 className="text-xl font-bold">Giáo viên: Lê Văn A</h4>
              <h4 className="text-xl font-bold">Sỉ số: 40</h4>
            </div>
            <div className="w-full mt-5">
              <div className="mt-8 grid gap-2 sm:grid-cols-1 md:grid-cols-3 custom">
                <ComplexStatisticsCard
                  color="primary"
                  icon="leaderboard"
                  title="Ít nhất"
                  count="0-1 điểm"
                  percentage={{
                    color: "primary",
                    amount: "0-1 điểm",
                    label: "chiếm tỉ lệ ít nhất",
                  }}
                />
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Nhiều nhất"
                  count="8-9 điểm"
                  percentage={{
                    color: "info",
                    amount: "8-9 điểm",
                    label: "chiếm tỉ lệ cao nhất",
                  }}
                />
                <ComplexStatisticsCard
                  color="success"
                  icon="leaderboard"
                  title="Điểm trung bình"
                  count="8.0"
                  percentage={{
                    color: "success",
                    amount: "8.0",
                    label: "là điểm trung bình",
                  }}
                />
              </div>
              <div className="table w-full mt-8">
                <div
                  className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                  style={{ background: "#E9F7FF" }}
                >
                  <BarChart
                    dataset={datasetDetailedMarksfForSubjectOfClass}
                    xAxis={[
                      {
                        scaleType: "band",
                        dataKey: "Điểm",
                        tickPlacement,
                        tickLabelPlacement,
                      },
                    ]}
                    {...chartDetailedMarksfForSubjectOfClass}
                  />
                </div>
              </div>
              <div className="mt-8 custom-table">
                <p className="text-base font-bold">THỐNG KÊ CHI TIẾT MÔN TOÁN (HK1, 2023)</p>
                <TableComponent
                  header={["Họ và tên", "Mã học sinh", "Điểm", "Hạng"]}
                  data={detailedMarksfForSubjectOfClass}
                  // onEdit={handleEdit}
                  onDetails={handleDetails}
                  // onDelete={handleDelete}
                  className="mt-4"
                />
              </div>
            </div>
          </>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
