import { Card, FormControl, InputLabel, MenuItem, Select, Tab, Tabs } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import "./style.scss";

import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { schoolYears } from "mock/schoolYear";
import { TabPanel } from "components/TabPanelComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { studentClasses } from "mock/class";
import { subjects } from "mock/subject";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TableComponent from "components/TableComponent/TableComponent";

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = ["Khối 10", "Khối 11", "Khối 12"];

const datasetAcademicPerformenceOfAllSchools = [
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Khối: "Khối 10",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Khối: "Khối 11",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Khối: "Khối 12",
  },
];

const datasetAcademicPerformenceOfGrades = [
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A1",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A2",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A3",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A4",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A5",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A6",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A7",
  },
  {
    Giỏi: 59,
    Khá: 57,
    TB: 86,
    Yếu: 21,
    Lớp: "12A8",
  },
];
const chartSetting = {
  yAxis: [
    {
      label: "Số phần trăm",
      min: 0,
      max: 100,
    },
  ],
  width: 1000,
  height: 500,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-10px, 0)",
    },
  },
};

const valueFormatter = (value) => `${value}%`;

export default function AcademicPerformanceStatistics() {
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

  const handleStatisticSubjectSchool = () => {
    console.log("Call api by all school: ", { schoolYear, schoolSemester, schoolSubject });
  };

  const handleStatisticSubjectGrads = () => {
    console.log("Call api by grad: ", { schoolYear, schoolSemester, schoolSubject, grade });
  };

  const handleStatisticSubjectClass = () => {
    console.log("Call api by class: ", {
      schoolYear,
      schoolSemester,
      schoolSubject,
      grade,
      schoolClass,
    });
  };

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabels = ["HỌC LỰC TOÀN TRƯỜNG", "HỌC LỰC THEO KHỐI", "TAB 3", "TAB 4", "TAB 5"];

  const academicPerformenceOfAllSchoolsBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Học sinh giỏi",
      count: "20%",
      textDescriptionColor: "primary",
      amount: "Học sinh giỏi",
      label: "có tỉ lệ thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Học sinh khá",
      count: "30%",
      textDescriptionColor: "info",
      amount: "Học sinh khá",
      label: "",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Học sinh trung bình",
      count: "40%",
      textDescriptionColor: "success",
      amount: "Học sinh khá",
      label: "",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Học sinh yếu",
      count: "10%",
      textDescriptionColor: "info",
      amount: "Học sinh yếu",
      label: "có tỉ lệ cao nhất",
    },
  ];

  const academicPerformenceOfGradesBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Học sinh giỏi",
      count: "20%",
      textDescriptionColor: "primary",
      amount: "Học sinh giỏi",
      label: "có tỉ lệ thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Học sinh khá",
      count: "30%",
      textDescriptionColor: "info",
      amount: "Học sinh khá",
      label: "",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Học sinh trung bình",
      count: "40%",
      textDescriptionColor: "success",
      amount: "Học sinh trung bình",
      label: "",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Học sinh yếu",
      count: "10%",
      textDescriptionColor: "info",
      amount: "Học sinh yếu",
      label: "có tỉ lệ cao nhất",
    },
  ];
  const [academicPerformenceOfGrades, setAcademicPerformenceOfGrades] = useState([
    ["12A1", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A2", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A3", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A4", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A5", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A6", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A7", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A8", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A9", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A10", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A11", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
    ["12A12", "50", "Lê Văn A", "10", "20", "30", "40", "HSG"],
  ]);
  const [academicPerformenceOfAllSchools, setAcademicPerformenceOfAllSchools] = useState([
    ["Khối 10", "50", "10", "20", "30", "40", "HSG"],
    ["Khối 11", "50", "10", "20", "30", "40", "HSG"],
    ["Khối 12", "50", "10", "20", "30", "40", "HSG"],
  ]);

  (React.useState < "middle") | ("tick" > "middle");
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          <div className="w-full mb-10">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              sx={{
                width: "100%",
                textAlign: "left",
                paddingX: 1,
                paddingY: 2,
                "& .Mui-selected": {
                  backgroundColor: "#247cd4",
                  color: "white !important",
                  fontWeight: "bold",
                  paddingY: 2,
                },
              }}
            >
              {tabLabels.map((item, index) => (
                <Tab key={index} label={item} />
              ))}
            </Tabs>

            <TabPanel value={value} index={0}>
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
                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleStatisticSubjectSchool}
                >
                  <FilterAltIcon className="mr-1" /> Thống kê
                </ButtonComponent>
              </div>
              <div className="text-center mt-8">
                <h4 className="text-xl font-bold">Thống kê học lực trường THPT Nguyễn Việt Hồng</h4>
                <h4 className="text-xl font-bold">
                  Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                </h4>
              </div>
              <div className="mt-8 grid gap-2 sm:grid-cols-2 md:grid-cols-4 custom">
                {academicPerformenceOfAllSchoolsBox.map((item, index) => (
                  <ComplexStatisticsCard
                    key={index}
                    color={item.color}
                    icon={item.icon}
                    title={item.title}
                    count={item.count}
                    percentage={{
                      color: item.textDescriptionColor,
                      amount: item.amount,
                      label: item.label,
                    }}
                  />
                ))}
              </div>
              <div
                className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                style={{ background: "#E9F7FF" }}
              >
                <BarChart
                  dataset={datasetAcademicPerformenceOfAllSchools}
                  xAxis={[
                    { scaleType: "band", dataKey: "Khối", tickPlacement, tickLabelPlacement },
                  ]}
                  series={[
                    { dataKey: "Giỏi", label: "Giỏi", valueFormatter },
                    { dataKey: "Khá", label: "Khá", valueFormatter },
                    { dataKey: "TB", label: "TB", valueFormatter },
                    { dataKey: "Yếu", label: "Yếu", valueFormatter },
                  ]}
                  {...chartSetting}
                />
              </div>

              <div className="mt-8 custom-table">
                <p className="text-base font-bold">THỐNG KÊ CHI TIẾT</p>
                <TableComponent
                  header={[
                    "Khối",
                    "Số lượng",
                    "Số HSG",
                    "Số HSK",
                    "Số HSTB",
                    "Số HSY",
                    "Nhiều nhất",
                  ]}
                  data={academicPerformenceOfAllSchools}
                  // onEdit={handleEdit}
                  onDetails={handleDetails}
                  // onDelete={handleDelete}
                  className="mt-4"
                />
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
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
                  <InputLabel id="select-school-class-lable">Lớp</InputLabel>
                  <Select
                    labelId="select-school-class-lable"
                    id="select-school-class"
                    value={schoolClass}
                    className="h-11 mr-3"
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
                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleStatisticSubjectSchool}
                >
                  <FilterAltIcon className="mr-1" /> Thống kê
                </ButtonComponent>
              </div>
              <div className="text-center mt-8">
                <h4 className="text-xl font-bold">
                  Thống kê học lực khối {grade} trường THPT Nguyễn Việt Hồng
                </h4>
                <h4 className="text-xl font-bold">
                  Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                </h4>
              </div>
              <div className="mt-8 grid gap-2 sm:grid-cols-2 md:grid-cols-4 custom">
                {academicPerformenceOfGradesBox.map((item, index) => (
                  <ComplexStatisticsCard
                    key={index}
                    color={item.color}
                    icon={item.icon}
                    title={item.title}
                    count={item.count}
                    percentage={{
                      color: item.textDescriptionColor,
                      amount: item.amount,
                      label: item.label,
                    }}
                  />
                ))}
              </div>
              <div
                className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                style={{ background: "#E9F7FF" }}
              >
                <BarChart
                  dataset={datasetAcademicPerformenceOfGrades}
                  xAxis={[{ scaleType: "band", dataKey: "Lớp", tickPlacement, tickLabelPlacement }]}
                  series={[
                    { dataKey: "Giỏi", label: "Giỏi", valueFormatter },
                    { dataKey: "Khá", label: "Khá", valueFormatter },
                    { dataKey: "TB", label: "TB", valueFormatter },
                    { dataKey: "Yếu", label: "Yếu", valueFormatter },
                  ]}
                  {...chartSetting}
                />
              </div>

              <div className="mt-8 custom-table">
                <p className="text-base font-bold">THỐNG KÊ CHI TIẾT ({grade})</p>
                <TableComponent
                  header={[
                    "Lớp",
                    "Sỉ số",
                    "GVCN",
                    "Số HSG",
                    "Số HSK",
                    "Số HSTB",
                    "Số HSY",
                    "Nhiều nhất",
                  ]}
                  data={academicPerformenceOfGrades}
                  // onEdit={handleEdit}
                  onDetails={handleDetails}
                  // onDelete={handleDelete}
                  className="mt-4"
                />
              </div>
            </TabPanel>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
