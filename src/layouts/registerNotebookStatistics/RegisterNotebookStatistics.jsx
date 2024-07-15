import {
  Box,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
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
import { statisticOfRegisterNotebook } from "../../services/StatisticService";
import { useQuery } from "react-query";

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

const valueASubjectForAGrade = (value) => {
  if (typeof value === "number" || value === null) {
    return `${value} điểm`;
  }
  throw new Error("Value must be a number or null");
};

const chartSchoolBookForEntireSchool = {
  yAxis: [
    {
      label: "Điểm sổ đầu bài",
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
  series: [{ dataKey: "Điểm", label: "Lớp học", valueASubjectForAGrade, color: "#247CD4" }],
  height: 500,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

export default function RegisterNotebookStatistics() {
  let accessToken, userRole, schoolYearsAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
  }

  const [currentData, setCurrentData] = useState([]);
  const [chartFormattedData, setChartFormattedData] = useState([]);
  const [highestMark, setHighestMark] = useState({ mark: 0, class: "Chưa thống kê!" });
  const [lowestMark, setLowerMark] = useState({ mark: 0, class: "Chưa thống kê!" });
  const [averageMark, setAverageMark] = useState(0);
  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [schoolWeek, setSchoolWeek] = React.useState(schoolWeeks[0].name);
  const handleSchoolWeeksSelectedChange = (event) => {
    setSchoolWeek(event.target.value);
  };

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["registerNotebookStatistic", { accessToken, schoolYear }],
    queryFn: () => statisticOfRegisterNotebook(accessToken, schoolYear),
    enabled: false,
  });

  const handleDetails = (rowItem) => {
    console.log("Details row:", rowItem);
    // Implement delete logic here
  };

  const handleStatisticSubjectSchool = () => {
    refetch().then((result) => {
      if (result.data?.success) {
        const { transformedData, chartFormattedData } = transformData(result.data?.data);
        setCurrentData(transformedData);
        setChartFormattedData(chartFormattedData);
      }
    });
  };
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabLabels = ["ĐIỂM SĐB THEO TUẦN", "ĐIỂM SĐB CẢ NĂM"];

  const handleStatisticSubjectGrades = () => {
    refetch().then((result) => {
      if (result.data?.success) {
        const { transformedData, chartFormattedData } = transformData(result.data?.data);
        setCurrentData(transformedData);
        setChartFormattedData(chartFormattedData);
      }
    });
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
      count: `${lowestMark?.mark} điểm`,
      textDescriptionColor: "primary",
      amount: `Lớp ${lowestMark?.class}`,
      label: "có TB thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Điểm trung bình",
      count: `${averageMark} điểm`,
      textDescriptionColor: "info",
      amount: "Điểm TB giữa tất cả các lớp",
      label: "",
    },
    {
      color: "success",
      icon: "leaderboard",
      title: "Điểm cao nhất",
      count: `${highestMark?.mark} điểm`,
      textDescriptionColor: "success",
      amount: `Lớp ${highestMark?.class}`,
      label: "có TB cao nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Tổng số lớp",
      count: currentData?.length || 0,
      textDescriptionColor: "info",
      amount: currentData?.length || 0,
      label: "là tổng số lượng lớp",
    },
  ];

  const [aSubjectForEntireSchool, setASchoolBookForEntireSchool] = useState([
    ["Khối 10", "500", "1500", "1"],
    ["Khối 11", "500", "1600", "2"],
    ["Khối 12", "500", "1700", "3"],
  ]);

  (React.useState < "middle") | ("tick" > "middle");
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");

  function transformData(data) {
    // Extract total marks and add to each object
    data.forEach((item) => {
      item.rankCounts.totalMark = item.rankCounts[""];
      delete item.rankCounts[""];
    });

    // Sort data by totalMark in descending order
    data.sort((a, b) => b.rankCounts.totalMark - a.rankCounts.totalMark);

    // Assign ranks based on sorted order
    data.forEach((item, index) => {
      item.rankCounts.rank = index + 1;
    });

    // Get the highest and lowest totalMark
    setHighestMark({ mark: data[0].rankCounts.totalMark, class: data[0].className });
    setLowerMark({
      mark: data[data.length - 1].rankCounts.totalMark,
      class: data[data.length - 1].className,
    });

    // Transform data into the desired format
    const chartFormattedData = data.map((item) => ({
      Điểm: item.rankCounts.totalMark,
      Lớp: `Lớp ${item.className}`,
    }));

    // Sort chartFormattedData by totalMark in ascending order
    chartFormattedData.sort((a, b) => a.Điểm - b.Điểm);

    const totalMarks = data.reduce((sum, item) => sum + item.rankCounts.totalMark, 0);
    const averageMark = totalMarks / data.length;
    setAverageMark(averageMark);
    return {
      transformedData: data,
      chartFormattedData,
    };
  }

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
                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleStatisticSubjectSchool}
                >
                  <FilterAltIcon className="mr-1" /> THỐNG KÊ
                </ButtonComponent>
              </div>
              <>
                <div className="text-center mt-8">
                  <h4 className="text-xl font-bold">THỐNG KÊ ĐIỂM SỔ ĐẦU BÀI THEO TUẦN</h4>
                </div>

                <div className="mt-4 w-full grid gap-4 sm:grid-cols-1 md:grid-cols-2 overflow-x-auto">
                  <div
                    className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                    style={{ background: "#E9F7FF" }}
                  >
                    <BarChart
                      dataset={chartFormattedData}
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
                      <p className="text-base font-bold h-3">THỐNG KÊ CHI TIẾT</p>
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

                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleStatisticSubjectGrades}
                >
                  <FilterAltIcon className="mr-1" /> THỐNG KÊ
                </ButtonComponent>
              </div>
              <>
                <div className="text-center mt-6">
                  <h4 className="text-xl font-bold">THỐNG KÊ SỔ ĐẦU BÀI NĂM HỌC {schoolYear}</h4>
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
                    dataset={chartFormattedData}
                    xAxis={[
                      { scaleType: "band", dataKey: "Lớp", tickPlacement, tickLabelPlacement },
                    ]}
                    {...chartSchoolBookForAGrade}
                  />
                </div>

                <div className="mt-8 custom-table">
                  <p className="text-base font-bold">THỐNG KÊ CHI TIẾT</p>
                  {isLoading ? (
                    <div className="text-center primary-color my-30 text-xl italic font-medium">
                      <div className="mx-auto flex items-center justify-center">
                        <p className="mr-3">Loading</p>
                        <CircularProgress size={24} color="inherit" />
                      </div>
                    </div>
                  ) : data?.success && currentData.length > 0 ? (
                    <TableComponent
                      header={["Lớp", "Điểm TB", "Hạng"]}
                      data={currentData?.map((item) => [
                        item.className,
                        item.rankCounts.totalMark,
                        item.rankCounts.rank,
                      ])}
                      onDetails={handleDetails}
                      className="mt-4"
                    />
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
              </>
            </TabPanel>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
