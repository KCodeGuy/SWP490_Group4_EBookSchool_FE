import {
  Card,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import noDataImage3 from "../../assets/images/noDataImage3.avif";

import { BarChart, axisClasses } from "@mui/x-charts";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useQuery } from "react-query";

import "./style.scss";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TableComponent from "components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { TabPanel } from "../../components/TabPanelComponent";
import { statisticOfMark } from "../../services/StatisticService";
import { generateClasses } from "../../utils/CommonFunctions";
import { getAllSubjects } from "../../services/SubjectService";

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = [10, 11, 12];

const valueASubjectForAGrade = (value) => {
  if (typeof value === "number" || value === null) {
    return `${value} điểm`;
  }
  throw new Error("Value must be a number or null");
};

const valueDetailedMarksfForSubjectOfClass = (value) => {
  if (typeof value === "number" || value === null) {
    return `${value} học sinh`;
  }
  throw new Error("Value must be a number or null");
};

const chartDetailedMarksfForSubjectOfClass = {
  yAxis: [
    {
      label: "Số lượng điểm",
    },
  ],
  series: [
    {
      dataKey: "count",
      label: "Than điểm",
      valueDetailedMarksfForSubjectOfClass,
      color: "#247CD4",
    },
  ],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

const chartAverageTestMarksByClass = {
  yAxis: [
    {
      label: "Điểm",
      min: 1, // Setting the minimum value of the y-axis
      max: 10, // Setting the maximum value of the y-axis
    },
  ],
  series: [
    { dataKey: "Toán", label: "Trung bình điểm thi", valueASubjectForAGrade, color: "#247CD4" },
  ],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

const chartAverageMarksOfClass = {
  yAxis: [
    {
      label: "Điểm",
      min: 1, // Setting the minimum value of the y-axis
      max: 10, // Setting the maximum value of the y-axis
    },
  ],
  series: [{ dataKey: "Điểm", label: "Trung bình môn", valueASubjectForAGrade, color: "#247CD4" }],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};
export default function MarkStatistics() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [highestMark, setHighestMark] = useState("");
  const [lowestMark, setLowestMark] = useState("");
  const [averageMark, setAverageMark] = useState(0);

  const tabLabels = ["ĐIỂM MÔN TOÀN TRƯỜNG", "ĐIỂM THEO KHỐI", "ĐIỂM THEO MÔN", "ĐIỂM THEO LỚP"];

  let accessToken, currentUser, userRole, userID, schoolYearsAPI, classesAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    classesAPI = JSON.parse(localStorage.getItem("currentClasses"));
    currentUser = JSON.parse(localStorage.getItem("user"));
    userID = currentUser.id;
  }
  const [currentData, setCurrentData] = useState([]);
  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  //call api get all
  const {
    data: subjects,
    error,
    isLoading: isLoadingSubject,
  } = useQuery(["subjectState", { accessToken }], () => getAllSubjects(accessToken));

  const [schoolSemester, setSchoolSemester] = React.useState(semesters[0]);
  const handleSchoolSemesterSelectedChange = (event) => {
    setSchoolSemester(event.target.value);
  };

  const [schoolGrade, setSchoolGrade] = React.useState(grades[0]);
  const handleGradeSelectedChange = (event) => {
    setSchoolGrade(event.target.value);
  };

  const classesOfSchoolYear = generateClasses(classesAPI, schoolYear);

  const [schoolClass, setSchoolClass] = React.useState(classesOfSchoolYear[0]?.Classroom);
  const handleChangeClass = (event) => {
    setSchoolClass(event.target.value);
  };

  const formattedClasses = classesOfSchoolYear.map((item) => ({
    label: item.Classroom,
    value: item.ID,
  }));

  const [schoolSubject, setSchoolSubject] = React.useState("");
  const handleSchoolSubjectSelectedChange = (event) => {
    setSchoolSubject(event.target.value);
  };

  const formattedSubjects = subjects
    ?.filter((item) => item.isMark) // filter only items with isMark = true
    ?.map((item) => ({
      label: `${item.name} (Khối-${item.grade})`,
      name: item.name,
      value: item.name,
      grade: item.grade,
    }))
    ?.sort((a, b) => a.grade - b.grade); // sort by grade

  const handleDetails = (rowItem) => {
    console.log("Details row:", rowItem);
    // Implement delete logic here
  };

  // Find the item with the highest count
  const getHighestMark = (data) => {
    if (data.length > 0) {
      return data?.reduce((max, item) => (item.count > max.count ? item : max), data[0]);
    }
    return 0;
  };

  const getLowerMark = (data) => {
    if (data.length > 0) {
      return currentData?.reduce((min, item) => (item.count < min.count ? item : min), data[0]);
    }
    return 0;
  };

  const getAverageMark = (data) => {
    if (data.length > 0) {
      const total = currentData?.reduce((sum, item) => sum + item.count, 0);
      return total / data.length;
    }
    return 0;
  };

  const handleStatisticSubjectClass = () => {
    let highestMark = "";
    let lowestMark = "";
    let averageMark = 0;
    refetch().then((result) => {
      if (result.data) {
        if (schoolSemester == "Học kì I") {
          setCurrentData(result.data[0].scores);
          highestMark = getHighestMark(result.data[0].scores);
          lowestMark = getLowerMark(result.data[0].scores);
          averageMark = getAverageMark(result.data[0].scores);
          console.log(highestMark);
          console.log(lowestMark);
          console.log(averageMark);
        } else if (schoolSemester == "Học kì II") {
          setCurrentData(result.data[1].scores);
          highestMark = getHighestMark(result.data[1].scores);
          lowestMark = getLowerMark(result.data[1].scores);
          averageMark = getAverageMark(result.data[1].scores);
        } else if (schoolSemester == "Cả năm") {
          setCurrentData(result.data[2].scores);
          highestMark = getHighestMark(result.data[2].scores);
          lowestMark = getLowerMark(result.data[2].scores);
          averageMark = getAverageMark(result.data[2].scores);
        }
      }
    });
    console.log(highestMark.averageScore);
    console.log(lowestMark.averageScore);
    console.log(averageMark);
    setHighestMark(highestMark);
    setLowestMark(lowestMark);
    setAverageMark(averageMark);
  };

  const detailedMarksfForSubjectOfClassBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Ít nhất",
      count: `${lowestMark} điểm`,
      textDescriptionColor: "primary",
      amount: `${highestMark} điểm`,
      label: "chiếm tỉ lệ ít nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Nhiều nhất",
      count: `${highestMark} điểm`,
      textDescriptionColor: "info",
      amount: `${highestMark} điểm`,
      label: "chiếm tỉ lệ cao nhất",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Điểm trung bình",
      count: `${averageMark} điểm`,
      textDescriptionColor: "success",
      amount: `${averageMark} điểm`,
      label: "là điểm trung bình",
    },
  ];

  const averageTestMarksByClassBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Điểm thấp nhất",
      count: "4.95",
      textDescriptionColor: "primary",
      amount: "12A1",
      label: "có điểm TB thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Điểm trung bình",
      count: "8.75",
      textDescriptionColor: "info",
      amount: "Điểm trung bình giữa các lớp",
      label: "",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Điểm cao nhất",
      count: "10",
      textDescriptionColor: "success",
      amount: "12A2",
      label: "có điểm TB cao nhất",
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

  const averageMarksOfClassBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Điểm thấp nhất",
      count: "4.95",
      textDescriptionColor: "primary",
      amount: "Ngữ Văn",
      label: "có điểm TBM thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Điểm trung bình",
      count: "8.75",
      textDescriptionColor: "info",
      amount: "Điểm trung bình môn",
      label: "",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Điểm cao nhất",
      count: "10",
      textDescriptionColor: "success",
      amount: "Hóa học",
      label: "có điểm TBM cao nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Sỉ số",
      count: "40",
      textDescriptionColor: "info",
      amount: "40",
      label: "là sỉ số lớp",
    },
  ];
  (React.useState < "middle") | ("tick" > "middle");
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["markStatistic"],
    queryFn: () => {
      if (value === 1) {
        return statisticOfMark(accessToken, schoolYear, "schoolGrade", schoolGrade);
      } else if (value === 2) {
        return statisticOfMark(accessToken, schoolYear, "schoolSubject", schoolSubject);
      } else if (value === 3) {
        return statisticOfMark(accessToken, schoolYear, "schoolClass", schoolClass);
      } else if (value == 0) {
        return statisticOfMark(accessToken, schoolYear, "schoolYear", schoolYear);
      }
    },
    enabled: false,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="mb-8">
        <MDBox p={5}>
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
            <TabPanel value={value} index={value}>
              <div className="flex justify-between">
                <div className="left">
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="select-school-year-lable">Năm học</InputLabel>
                    <Select
                      labelId="select-school-year-lable"
                      id="elect-school-year"
                      value={schoolYear}
                      className="h-10 mr-2 max-[767px]:mb-4"
                      label="Năm học"
                      onChange={handleSchoolYearSelectedChange}
                    >
                      {schoolYearsAPI?.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="select-semester-lable">Học kỳ</InputLabel>
                    <Select
                      labelId="select-semester-lable"
                      id="select-semester"
                      value={schoolSemester}
                      className="h-10 mr-2 max-[767px]:mb-4"
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
                  {value == 1 ? (
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="select-school-grade-lable">Khối lớp</InputLabel>
                      <Select
                        labelId="select-school-grade-lable"
                        id="select-grade"
                        value={schoolGrade}
                        className="h-10 mr-2 max-[767px]:mb-4"
                        label="Năm học"
                        onChange={handleGradeSelectedChange}
                      >
                        {grades?.map((item, index) => (
                          <MenuItem key={index} value={item}>
                            {`Khối ${item}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : value == 2 ? (
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="select-school-subject-lable">Môn học</InputLabel>
                      <Select
                        labelId="select-school-subject-lable"
                        id="select-school-subject"
                        value={schoolSubject}
                        className="h-10 mr-2 max-[767px]:mb-4"
                        label="Môn học"
                        onChange={handleSchoolSubjectSelectedChange}
                      >
                        {formattedSubjects?.map((item, index) => (
                          <MenuItem key={index} value={item.name}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : value == 3 ? (
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="select-school-class-lable">Lớp</InputLabel>
                      <Select
                        labelId="select-school-class-lable"
                        id="select-school-class"
                        value={schoolClass}
                        className="h-10 mr-2 max-[767px]:mb-4"
                        label="Lớp"
                        onChange={handleChangeClass}
                      >
                        {formattedClasses?.map((item, index) => (
                          <MenuItem key={index} value={item.label}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    ""
                  )}

                  <ButtonComponent
                    type="success"
                    className="max-[639px]:w-full"
                    onClick={handleStatisticSubjectClass}
                  >
                    <FilterAltIcon className="mr-1" /> THỐNG KÊ
                  </ButtonComponent>
                </div>
              </div>
              <>
                <div className="text-center mt-8">
                  <h4 className="text-xl font-bold uppercase">Thống kê chi tiết điểm</h4>
                  <h4 className="text-xl font-bold uppercase">
                    Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                  </h4>
                </div>
                <div className="w-full mt-5">
                  <div className="mt-8 custom-table">
                    {isLoading ? (
                      <div className="text-center primary-color my-10 text-xl italic font-medium">
                        <div className="mx-auto flex items-center justify-center">
                          <p className="mr-3">Loading</p>
                          <CircularProgress size={24} color="inherit" />
                        </div>
                      </div>
                    ) : data && currentData.length > 0 ? (
                      <>
                        <div className="mt-8 grid gap-4 sm:grid-cols-1 md:grid-cols-3 custom">
                          {detailedMarksfForSubjectOfClassBox.map((item, index) => (
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
                          <div
                            className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                            style={{ background: "#E9F7FF" }}
                          >
                            <BarChart
                              dataset={currentData}
                              xAxis={[
                                {
                                  scaleType: "band",
                                  dataKey: "averageScore",
                                  tickPlacement,
                                  tickLabelPlacement,
                                },
                              ]}
                              {...chartDetailedMarksfForSubjectOfClass}
                            />
                          </div>
                        </div>
                        <p className="text-base font-bold mt-6">
                          THỐNG KÊ CHI TIẾT MÔN TOÁN (HK1, 2023)
                        </p>

                        <TableComponent
                          header={["Than điểm", "Số lượng"]}
                          data={currentData?.map((item) => [item.averageScore, item.count])}
                          onDetails={handleDetails}
                          className="mt-4"
                        />
                      </>
                    ) : (
                      <div className="text-center primary-color my-10 text-xl italic font-medium">
                        <img
                          className="w-60 h-60 object-cover object-center mx-auto"
                          src={noDataImage3}
                          alt="Chưa có dữ liệu!"
                        />
                        Chưa có dữ liệu!
                      </div>
                    )}
                  </div>
                </div>
              </>
            </TabPanel>
            {/* <TabPanel value={value} index={1}>
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
                  <h4 className="text-xl font-bold">
                    Thống kê TB điểm thi môn {schoolSubject} lớp {schoolClass}
                  </h4>
                  <h4 className="text-xl font-bold">
                    Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                  </h4>
                </div>
                <div className="w-full custom mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {averageTestMarksByClassBox.map((item, index) => (
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
                    dataset={datasetAverageTestMarksByClass}
                    xAxis={[
                      { scaleType: "band", dataKey: "Lớp", tickPlacement, tickLabelPlacement },
                    ]}
                    {...chartAverageTestMarksByClass}
                  />
                </div>

                <div className="mt-8 custom-table">
                  <p className="text-base font-bold">THỐNG KÊ CHI TIẾT ({schoolSubject})</p>
                  <TableComponent
                    header={["Lớp", "Sỉ số", "Giáo viên", "Điểm TB", "Hạng"]}
                    data={averageTestMarksByClass}
                    // onEdit={handleEdit}
                    onDetails={handleDetails}
                    // onDelete={handleDelete}
                    className="mt-4"
                  />
                </div>
              </>
            </TabPanel> */}
            {/* 
            <TabPanel value={value} index={4}>
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
                  onClick={handleStatisticSubjectGrades}
                >
                  <FilterAltIcon className="mr-1" /> Thống kê
                </ButtonComponent>
              </div>
              <>
                <div className="text-center mt-6">
                  <h4 className="text-xl font-bold">Thống kê TBM lớp {schoolClass}</h4>
                  <h4 className="text-xl font-bold">
                    Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                  </h4>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-sm">
                    <span className="mr-2 font-bold">Giáo viên:</span>
                    <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                      Lương Hoàng Hướng
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="mr-2 font-bold">Sỉ số:</span>
                    <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                      40
                    </span>
                  </div>
                </div>
                <div className="w-full custom mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {averageMarksOfClassBox.map((item, index) => (
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
                    dataset={datasetAverageMarksOfClass}
                    xAxis={[
                      { scaleType: "band", dataKey: "Môn", tickPlacement, tickLabelPlacement },
                    ]}
                    {...chartAverageMarksOfClass}
                  />
                </div>
              </>
            </TabPanel> */}
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
