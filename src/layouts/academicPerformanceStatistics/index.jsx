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
import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useQuery } from "react-query";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import "./style.scss";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import TableComponent from "components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { TabPanel } from "../../components/TabPanelComponent";
import { statisticOfAcademicPerformance, statisticOfMark } from "../../services/StatisticService";
import { generateClasses } from "../../utils/CommonFunctions";
import { getAllSubjects } from "../../services/SubjectService";
import { grade } from "mock/grade";
import { subject } from "mock/subject";
import { Class, Subject } from "@mui/icons-material";
import PopupComponent from "components/PopupComponent/PopupComponent";
import TextValueComponent from "components/TextValueComponent";

const semesters = ["Học kì I", "Học kì II", "Cả năm"];

const grades = [12, 11, 10];

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
      label: "Số lượng học sinh",
    },
  ],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function AcademicPerformanceStatistics() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [detail, setDetail] = useState({});
  const [openModalDetail, setOpenModalDetail] = useState(false);

  const [highestMark, setHighestMark] = useState("");
  const [lowestMark, setLowestMark] = useState("");
  const [averageMark, setAverageMark] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const tabLabels = ["HỌC LỰC TOÀN TRƯỜNG", "HỌC LỰC THEO KHỐI", "HỌC LỰC THEO LỚP"];

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

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      setSchoolSubject(subjects[0].name);
    }
  }, [subjects]);

  const formattedSubjects = subjects
    ?.filter((item) => item.isMark) // filter only items with isMark = true
    ?.map((item) => ({
      label: `${item.name}`,
      name: item.name,
      value: item.name,
      grade: item.grade,
    }))
    ?.sort((a, b) => a.grade - b.grade); // sort by grade

  // Filter out duplicates by name
  const uniqueSubjects = [];
  const uniqueNames = new Set();

  formattedSubjects?.forEach((item) => {
    if (!uniqueNames.has(item.name)) {
      uniqueNames.add(item.name);
      uniqueSubjects.push(item);
    }
  });

  const handleDetails = (rowItem) => {
    if (rowItem) {
      setOpenModalDetail(true);
      const itemDetail = {
        averageScore: rowItem[0],
        count: rowItem[1],
      };
      setDetail(itemDetail);
    }
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
    // let highestMark = "";
    // let lowestMark = "";
    // let averageMark = 0;

    const vietnameseToEnglish = {
      Yếu: "poor",
      "Trung bình": "average",
      Khá: "good",
      Giỏi: "excellent",
    };

    const transformKeys = (data) => {
      return Object.keys(data).reduce((acc, key) => {
        acc[vietnameseToEnglish[key]] = data[key];
        return acc;
      }, {});
    };

    setSearchLoading(true); // start loading
    refetch()
      .then((result) => {
        if (result.data) {
          const transformedData = transformKeys(result.data);
          setCurrentData(transformedData);
        }
        setSearchLoading(false); // End loading
      })
      .catch(() => {
        setSearchLoading(false); // End loading in case of an error
      });
  };

  const calculatePercentage = (num, total) => {
    return Math.round((num / total) * 100);
  };

  const getTotalPercentage = (percentages) => {
    return Object.values(percentages).reduce((sum, value) => sum + value, 0);
  };

  const adjustPercentages = (percentages) => {
    const totalPercentage = getTotalPercentage(percentages);
    const difference = 100 - totalPercentage;

    if (difference !== 0) {
      const maxKey = Object.keys(percentages).reduce((a, b) =>
        percentages[a] > percentages[b] ? a : b
      );
      percentages[maxKey] += difference;
    }

    return percentages;
  };

  const totalStudents =
    currentData?.poor + currentData?.average + currentData?.good + currentData?.excellent;

  const initialPercentages = {
    poor: calculatePercentage(currentData?.poor, totalStudents),
    average: calculatePercentage(currentData?.average, totalStudents),
    good: calculatePercentage(currentData?.good, totalStudents),
    excellent: calculatePercentage(currentData?.excellent, totalStudents),
  };

  const adjustedPercentages = adjustPercentages(initialPercentages);

  const detailedMarksfForSubjectOfClassBox = [
    {
      color: "primary",
      icon: "leaderboard",
      title: "Loại yếu",
      count: `${adjustedPercentages?.poor} %`,
      textDescriptionColor: "primary",
      amount: `${currentData?.poor}`,
      label: "là số lượng học sinh yếu",
    },
    {
      color: "warning",
      icon: "leaderboard",
      title: "Loại trung bình",
      count: `${adjustedPercentages.average} %`,
      textDescriptionColor: "warning",
      amount: `${currentData?.average}`,
      label: "là số lượng học sinh trung bình",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Loại khá",
      count: `${adjustedPercentages.good} %`,
      textDescriptionColor: "info",
      amount: `${currentData?.good}`,
      label: "là số lượng học sinh khá",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Loại giỏi",
      count: `${adjustedPercentages.excellent} %`,
      textDescriptionColor: "success",
      amount: `${currentData?.excellent}`,
      label: "là số lượng học sinh giỏi",
    },
  ];

  (React.useState < "middle") | ("tick" > "middle");
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["academicPerformance"],
    queryFn: () => {
      if (value === 1) {
        return statisticOfAcademicPerformance(accessToken, schoolYear, "schoolGrade", schoolGrade);
      } else if (value === 2) {
        return statisticOfAcademicPerformance(accessToken, schoolYear, "schoolClass", schoolClass);
      } else if (value == 0) {
        return statisticOfAcademicPerformance(accessToken, schoolYear, "schoolYear", schoolYear);
      }
    },
    enabled: false,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
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
                      className="h-10 mr-2 max-[639px]:mb-4"
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
                  {value == 1 ? (
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="select-school-grade-lable">Khối</InputLabel>
                      <Select
                        labelId="select-school-grade-lable"
                        id="select-grade"
                        value={schoolGrade}
                        className="h-10 mr-2 max-[639px]:mb-4"
                        label="Khối"
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
                      <InputLabel id="select-school-class-lable">Lớp</InputLabel>
                      <Select
                        labelId="select-school-class-lable"
                        id="select-school-class"
                        value={schoolClass}
                        className="h-10 mr-2 max-[639px]:mb-4"
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
                  <h4 className="text-xl font-bold uppercase">
                    Thống kê học lực <br /> Năm học {schoolYear}
                  </h4>
                  <h4 className="text-xl font-bold uppercase">
                    {value == 1 ? `Khối ${schoolGrade} ` : value == 2 ? `Lớp ${schoolClass} ` : ""}
                    {/* {schoolSemester} */}
                  </h4>
                </div>
                <div className="w-full mt-6">
                  <div className="mt-8 custom-table">
                    {isLoading || searchLoading ? (
                      <div className="text-center primary-color my-10 text-xl italic font-medium">
                        <div className="mx-auto flex items-center justify-center">
                          <p className="mr-3">Loading</p>
                          <CircularProgress size={24} color="inherit" />
                        </div>
                      </div>
                    ) : currentData &&
                      (currentData?.poor > 0 ||
                        currentData?.average > 0 ||
                        currentData?.good > 0 ||
                        currentData?.excellent > 0) ? (
                      <>
                        <div className="mt-8 grid gap-4 sm:grid-cols-1 md:grid-cols-4 custom">
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
                              xAxis={[{ scaleType: "band", data: ["Xếp loại học lực"] }]}
                              series={[
                                { data: [currentData?.poor], label: "Yếu", color: "#e91e63" },
                                {
                                  data: [currentData?.average],
                                  label: "Trung bình",
                                  color: "#fb8c00",
                                },
                                { data: [currentData?.good], label: "Khá", color: "#247CD4" },
                                { data: [currentData?.excellent], label: "Giỏi", color: "#4caf50" },
                              ]}
                              {...chartDetailedMarksfForSubjectOfClass}
                            />
                          </div>
                        </div>
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
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
