import {
  Box,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { BarChart, PieChart, axisClasses } from "@mui/x-charts";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import MDBox from "components/MDBox";
import { TabPanel } from "components/TabPanelComponent";
import TableComponent from "components/TableComponent/TableComponent";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import { schoolYears } from "mock/schoolYear";
import { studentClasses } from "mock/class";
import SchoolBook from "layouts/shoolBook";

const schoolWeeks = [
  { id: 1, name: "week 1", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 2, name: "week 2", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 3, name: "week 3", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 4, name: "week 4", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 5, name: "week 5", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 6, name: "week 6", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 7, name: "week 7", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 8, name: "week 8", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 9, name: "week 9", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 10, name: "week 10", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 11, name: "week 11", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 12, name: "week 12", startTime: "20/1/2024", endTime: "28/1/2024" },
  { id: 13, name: "week 13", startTime: "20/1/2024", endTime: "28/1/2024" },
];

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = ["Khối 10", "Khối 11", "Khối 12"];

const datasetSchoolBookForEntireSchool = [
  {
    Điểm: 1500,
    Khối: "Khối 10",
  },
  {
    Điểm: 1600,
    Khối: "Khối 11",
  },
  {
    Điểm: 1700,
    Khối: "Khối 12",
  },
];

const datasetASchoolBookForAGrade = [
  {
    Điểm: 160,
    Lớp: "12A1",
  },
  {
    Điểm: 50,
    Lớp: "12A2",
  },
  {
    Điểm: 200,
    Lớp: "12A3",
  },
];

const valueASubjectForAGrade = (value) => {
  if (typeof value === "number" || value === null) {
    return `${value} điểm`;
  }
  throw new Error("Value must be a number or null");
};

const chartSchoolBookForEntireSchool = {
  yAxis: [
    {
      label: "Điểm",
    },
  ],
  series: [{ dataKey: "Điểm", label: "Điểm trung bình", valueASubjectForAGrade, color: "#247CD4" }],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

const chartSchoolBookForAGrade = {
  yAxis: [
    {
      label: "Điểm sổ đầu bài",
    },
  ],
  series: [{ dataKey: "Điểm", label: "Điểm", valueASubjectForAGrade, color: "#247CD4" }],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function RegisterNotebookStatistics() {
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

  const [schoolWeek, setSchoolWeek] = React.useState(schoolWeeks[0].name);
  const handleSchoolWeeksSelectedChange = (event) => {
    setSchoolWeek(event.target.value);
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

  const tabLabels = ["ĐIỂM SĐB TOÀN TRƯỜNG", "ĐIỂM SĐB THEO KHỐI"];

  const handleStatisticSubjectGrades = () => {
    console.log("Call api by grad: ", { schoolYear, schoolSemester, schoolSubject, grade });
  };

  const schoolBookOfAllSchoolsBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Điểm thấp nhất",
      count: "1500",
      textDescriptionColor: "primary",
      amount: "Khối 10",
      label: "có TB thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Điểm TB cả trường",
      count: "1600",
      textDescriptionColor: "info",
      amount: "1600",
      label: "là điểm TB cả trường",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Điểm cao nhất",
      count: "1700",
      textDescriptionColor: "success",
      amount: "Khối 12",
      label: "có TB cao nhất",
    },
  ];

  const aSchoolBookForAGradeBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Điểm thấp nhất",
      count: "4.75",
      textDescriptionColor: "primary",
      amount: "Lớp 12A1",
      label: "có TB thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Điểm trung bình",
      count: "8.75",
      textDescriptionColor: "info",
      amount: "Điểm TB giữa các lớp",
      label: "",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Điểm cao nhất",
      count: "10",
      textDescriptionColor: "success",
      amount: "Lớp 12A2",
      label: "có TB cao nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Tổng số lớp",
      count: "12",
      textDescriptionColor: "info",
      amount: "12",
      label: "là tổng số lượng lớp",
    },
  ];

  const [aSubjectForEntireSchool, setASchoolBookForEntireSchool] = useState([
    ["Khối 10", "500", "1500", "1"],
    ["Khối 11", "500", "1600", "2"],
    ["Khối 12", "500", "1700", "3"],
  ]);

  const [aSchoolBookForAGrade, setSchoolBookForAGrade] = useState([
    ["12A1", "40", "160", "1"],
    ["12A2", "40", "100", "1"],
    ["12A3", "40", "110", "1"],
    ["12A4", "40", "139", "1"],
    ["12A5", "40", "178", "1"],
    ["12A6", "40", "90", "1"],
    ["12A7", "40", "105", "1"],
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
                <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
                  <InputLabel id="select-school-week-lable">Tuần</InputLabel>
                  <Select
                    labelId="select-school-week-lable"
                    id="select-school-class"
                    value={schoolWeek}
                    className="h-10 mr-2 max-[767px]:mb-4"
                    label="Tuần"
                    onChange={handleSchoolWeeksSelectedChange}
                  >
                    {schoolWeeks.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.startTime} - {item.endTime}
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
              <>
                <div className="text-center mt-8">
                  <h4 className="text-xl font-bold">
                    Thống kê TB điểm SĐB trường THPT Nguyễn Việt Hồng
                  </h4>
                  <h4 className="text-xl font-bold">
                    Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                  </h4>
                </div>

                <div className="mt-4 w-full grid gap-4 sm:grid-cols-1 md:grid-cols-2 overflow-x-auto">
                  <div
                    className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                    style={{ background: "#E9F7FF" }}
                  >
                    <BarChart
                      dataset={datasetSchoolBookForEntireSchool}
                      xAxis={[
                        { scaleType: "band", dataKey: "Khối", tickPlacement, tickLabelPlacement },
                      ]}
                      {...chartSchoolBookForEntireSchool}
                    />
                  </div>
                  <div className="w-full">
                    <div className="mt-8 grid gap-2 sm:grid-cols-1 md:grid-cols-3 custom">
                      {schoolBookOfAllSchoolsBox.map((item, index) => (
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
                    <div className="table w-full mt-8">
                      <p className="text-base font-bold h-3">
                        THỐNG KÊ CHI TIẾT ({schoolWeek}, {schoolSemester}, {schoolYear})
                      </p>
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
                  onClick={handleStatisticSubjectGrades}
                >
                  <FilterAltIcon className="mr-1" /> Thống kê
                </ButtonComponent>
              </div>
              <>
                <div className="text-center mt-6">
                  <h4 className="text-xl font-bold">Thống kê điểm SĐB {grade}</h4>
                  <h4 className="text-xl font-bold">
                    Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                  </h4>
                </div>
                <div className="w-full custom mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {aSchoolBookForAGradeBox.map((item, index) => (
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
                    dataset={datasetASchoolBookForAGrade}
                    xAxis={[
                      { scaleType: "band", dataKey: "Lớp", tickPlacement, tickLabelPlacement },
                    ]}
                    {...chartSchoolBookForAGrade}
                  />
                </div>

                <div className="mt-8 custom-table">
                  <p className="text-base font-bold">THỐNG KÊ CHI TIẾT {grade}</p>
                  <TableComponent
                    header={["Lớp", "Số lượng", "Điểm TB", "Hạng"]}
                    data={aSchoolBookForAGrade}
                    // onEdit={handleEdit}
                    onDetails={handleDetails}
                    // onDelete={handleDelete}
                    className="mt-4"
                  />
                </div>
              </>
            </TabPanel>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
