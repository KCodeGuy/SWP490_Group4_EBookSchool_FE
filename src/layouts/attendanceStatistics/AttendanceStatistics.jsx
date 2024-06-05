import { Card, FormControl, Grid, InputLabel, MenuItem, Select, Tab, Tabs } from "@mui/material";
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
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TableComponent from "components/TableComponent/TableComponent";

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = ["Khối 10", "Khối 11", "Khối 12"];

const datasetAttendanceOfEntireSchool = [
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Khối: "10",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Khối: "11",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Khối: "12",
  },
];

const datasetAttendanceOfGrades = [
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A1",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A2",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A3",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A4",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A5",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A6",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A7",
  },
  {
    Tổng: 14,
    Phép: 20,
    Không: 5,
    Lớp: "12A8",
  },
];

const chartSetting = {
  yAxis: [
    {
      label: "Lượt vắng",
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

const valueFormatter = (value) => `${value} học sinh`;

export default function AttendanceStatistics() {
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
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabels = ["LƯỢT VẮNG TOÀN TRƯỜNG", "LƯỢT VẮNG THEO KHỐI"];

  const attendanceOfEntireSchoolBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Tổng lượt vắng",
      count: "50",
      textDescriptionColor: "primary",
      amount: "50",
      label: "là tổng lượt vắng",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Có phép",
      count: "20",
      textDescriptionColor: "info",
      amount: "20",
      label: "là lượt vắng có phép",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Không phép",
      count: "30",
      textDescriptionColor: "success",
      amount: "30",
      label: "là lượt vắng không phép",
    },
  ];
  const attendanceOfGradesBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Tổng lượt vắng",
      count: "50",
      textDescriptionColor: "primary",
      amount: "50",
      label: "là tổng lượt vắng",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Có phép",
      count: "20",
      textDescriptionColor: "info",
      amount: "20",
      label: "là lượt vắng có phép",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Không phép",
      count: "30",
      textDescriptionColor: "success",
      amount: "30",
      label: "là lượt vắng không phép",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Trung bình",
      count: "50",
      textDescriptionColor: "info",
      amount: "50",
      label: "là lượt vắng TB của trường",
    },
  ];

  const [attendanceOfEntireSchool, setAttendanceOfEntireSchool] = useState([
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
  ]);

  const [attendanceOfGrades, setAttendanceOfGrades] = useState([
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
    ["12A1", "50", "Lê Văn A", "10", "20", "30"],
  ]);

  const [attendanceOfAClass, setAttendanceOfAClassOfAClass] = useState([
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
    ["Lê Văn A", "CE161025", "HSG", "HSG", "HSG"],
  ]);
  (React.useState < "middle") | ("tick" > "middle");
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="mb-8">
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
                <h4 className="text-xl font-bold">
                  Thống kê lượt vắng {grade} trường THPT Nguyễn Việt Hồng
                </h4>
                <h4 className="text-xl font-bold">
                  Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                </h4>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3 custom">
                {attendanceOfEntireSchoolBox.map((item, index) => (
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
                  dataset={datasetAttendanceOfEntireSchool}
                  xAxis={[
                    { scaleType: "band", dataKey: "Khối", tickPlacement, tickLabelPlacement },
                  ]}
                  series={[
                    { dataKey: "Tổng", label: "Tổng lượt vắng", valueFormatter },
                    { dataKey: "Phép", label: "Có phép", valueFormatter },
                    { dataKey: "Không", label: "Không phép", valueFormatter },
                  ]}
                  {...chartSetting}
                />
              </div>

              <div className="mt-8 custom-table">
                <p className="text-base font-bold">THỐNG KÊ CHI TIẾT</p>
                <TableComponent
                  header={["Khối", "Số lượng", "GVCN", "Tổng lượt vắng", "Có phép", "Không phép"]}
                  data={attendanceOfEntireSchool}
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
              <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4 custom">
                {attendanceOfGradesBox.map((item, index) => (
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
                  dataset={datasetAttendanceOfGrades}
                  xAxis={[{ scaleType: "band", dataKey: "Lớp", tickPlacement, tickLabelPlacement }]}
                  series={[
                    { dataKey: "Tổng", label: "Tổng lượt vắng", valueFormatter },
                    { dataKey: "Phép", label: "Có phép", valueFormatter },
                    { dataKey: "Không", label: "Không phép", valueFormatter },
                  ]}
                  {...chartSetting}
                />
              </div>

              <div className="mt-8 custom-table">
                <p className="text-base font-bold">THỐNG KÊ CHI TIẾT ({grade})</p>
                <TableComponent
                  header={["Lớp", "Sỉ số", "GVCN", "Tổng lượt vắng", "Có phép", "Không phép"]}
                  data={attendanceOfGrades}
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
