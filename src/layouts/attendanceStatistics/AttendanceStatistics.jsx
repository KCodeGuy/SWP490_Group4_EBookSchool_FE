import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PersonIcon from "@mui/icons-material/Person";
import DoNotDisturbOffIcon from "@mui/icons-material/DoNotDisturbOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useQuery } from "react-query";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import { isTodayInSchoolYear } from "../../utils/CommonFunctions";
import { getWeekForDate } from "../../utils/CommonFunctions";
import { getTodayDate } from "../../utils/CommonFunctions";
import { generateSchoolWeeks } from "utils/CommonFunctions";
import TextValueComponent from "../../components/TextValueComponent";
import {
  statisticOfAttendance,
  statisticOfAttendanceWholeYear,
} from "../../services/StatisticService";

const grades = [12, 11, 10];

const chartSetting = {
  yAxis: [
    {
      label: "Lượt vắng",
    },
  ],
  height: 500,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-10px, 0)",
    },
  },
};

const valueFormatter = (value) => `${value} lượt vắng`;

export default function AttendanceStatistics() {
  const [currentData, setCurrentData] = useState([]);
  const [currentAttendanceDetail, setCurrentAttendanceDetail] = useState({});
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  let accessToken, userRole, schoolYearsAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
  }
  const { today } = getTodayDate();

  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [grade, setGrade] = React.useState(grades[0]);
  const handleGradeSelectedChange = (event) => {
    setGrade(event.target.value);
  };

  const schoolWeeks = generateSchoolWeeks(schoolYear);
  let currentWeek;
  if (isTodayInSchoolYear(schoolYear)) {
    currentWeek = getWeekForDate(schoolWeeks, today);
  }
  const [currentWeekDate, setCurrentWeekDate] = useState(currentWeek);
  const [schoolWeek, setSchoolWeek] = React.useState(currentWeekDate?.startTime);
  const [schoolWeekEnd, setSchoolWeekEnd] = React.useState(currentWeekDate?.endTime);
  const handleSchoolWeeksSelectedChange = (event) => {
    setSchoolWeek(event.target.value);
    setSchoolWeekEnd(event.target.value);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "attendanceStatistic",
      { accessToken, schoolYear, fromDate: schoolWeek, schoolWeekEnd, grade },
    ],
    queryFn: () => statisticOfAttendance(accessToken, schoolYear, schoolWeek, schoolWeekEnd, grade),
    enabled: false,
  });

  const {
    data: attendanceStatisticWholeYear,
    isLoading: isLoadingWholeYear,
    refetch: refetchWholeYear,
  } = useQuery({
    queryKey: ["attendanceStatisticWholeYear", { accessToken, schoolYear, grade }],
    queryFn: () => statisticOfAttendanceWholeYear(accessToken, schoolYear, grade),
    enabled: false,
  });

  const handleDetails = (rowItem) => {
    setOpenModalDetail(true);
    const attendanceDetail = {
      className: rowItem[0],
      grade: rowItem[1],
      teacher: rowItem[2],
      numberOfStudent: rowItem[3],
      numberOfPresent: rowItem[4],
      numberOfAbsent: rowItem[5],
      numberOfConfirmed: rowItem[6],
      numberOfUnconfirmed: rowItem[7],
    };
    setCurrentAttendanceDetail(attendanceDetail);
  };

  const handleStatisticByWeekly = () => {
    setSearchLoading(true); // start loading
    refetch()
      .then((result) => {
        if (result.data) {
          setCurrentData(result.data);
        }
        setSearchLoading(false); // End loading
      })
      .catch(() => {
        setSearchLoading(false); // End loading in case of an error
      });
  };

  const handleStatisticWholeYear = () => {
    setSearchLoading(true); // start loading
    refetchWholeYear()
      .then((result) => {
        if (result.data) {
          setCurrentData(result.data);
        }
        setSearchLoading(false); // End loading
      })
      .catch(() => {
        setSearchLoading(false); // End loading in case of an error
      });
  };

  const totalNumberOfAbsent = currentData?.reduce(
    (sum, item) => sum + item.numberOfAbsent + item.numberOfConfirmed,
    0
  );
  const totalNumberOfConfirmed = currentData?.reduce(
    (sum, item) => sum + item.numberOfConfirmed,
    0
  );

  const attendanceOfEntireSchoolBox = [
    {
      color: "info",
      icon: "leaderboard",
      title: "Tổng lượt vắng",
      count: `${totalNumberOfAbsent || 0} lượt`,
      textDescriptionColor: "info",
      amount: `${totalNumberOfAbsent || 0}`,
      label: "là tổng lượt vắng",
    },
    {
      color: "primary",
      icon: "leaderboard",
      title: "Vắng (K)",
      count: `${totalNumberOfAbsent - totalNumberOfConfirmed || 0} lượt`,
      textDescriptionColor: "primary",
      amount: `${totalNumberOfAbsent - totalNumberOfConfirmed || 0}`,
      label: "là tổng lượt vắng không phép",
    },
    {
      color: "warning",
      icon: "leaderboard",
      title: "Vắng (P)",
      count: `${totalNumberOfConfirmed || 0} lượt`,
      textDescriptionColor: "warning",
      amount: `${totalNumberOfConfirmed || 0}`,
      label: "là tổng lượt vắng có phép",
    },
  ];

  (React.useState < "middle") | ("tick" > "middle");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="w-full">
            <div className="flex justify-between flex-wrap">
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

                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="select-school-week-lable">Tuần</InputLabel>
                  <Select
                    labelId="select-school-week-lable"
                    id="select-school-week"
                    value={schoolWeek}
                    className="h-10 mr-2 max-[639px]:mb-4"
                    label="Tuần"
                    onChange={handleSchoolWeeksSelectedChange}
                  >
                    {schoolWeeks.map((item, index) => (
                      <MenuItem key={index} value={item.startTime}>
                        {item.startTime} - {item.endTime}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="select-school-grade-lable">Khối</InputLabel>
                  <Select
                    labelId="select-school-grade-lable"
                    id="select-grade"
                    value={grade}
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
                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleStatisticByWeekly}
                >
                  <FilterAltIcon className="mr-1" /> THỐNG KÊ
                </ButtonComponent>
              </div>
              <div className="mt-3 md:mt-0 max-[639px]:w-full">
                <ButtonComponent
                  type="primary"
                  className="max-[639px]:w-full "
                  onClick={handleStatisticWholeYear}
                >
                  <FilterAltIcon className="mr-1" /> CẢ NĂM
                </ButtonComponent>
              </div>
            </div>
            <div className="text-center mt-8">
              <h4 className="text-xl font-bold uppercase">Thống kê lượt vắng</h4>
              <h4 className="text-xl font-bold uppercase">Năm học {schoolYear}</h4>
              <h4 className="text-xl font-bold uppercase">Khối {grade}</h4>
            </div>

            <div className="mt-8 custom-table">
              {isLoading || isLoadingWholeYear || searchLoading ? (
                <div className="text-center primary-color py-20 text-xl italic font-medium my-10">
                  <div className="mx-auto flex items-center justify-center">
                    <p className="mr-3">Loading</p>
                    <CircularProgress size={24} color="inherit" />
                  </div>
                </div>
              ) : currentData?.length > 0 ? (
                <>
                  <div className="mt-10 grid gap-4 md:grid-cols-3 custom">
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
                      dataset={currentData?.map((item) => ({
                        className: item.className,
                        numberOfAbsent: item.numberOfAbsent + item.numberOfConfirmed,
                        numberOfUnconfirmed: item.numberOfAbsent,
                        numberOfConfirmed: item.numberOfConfirmed,
                      }))}
                      xAxis={[
                        {
                          scaleType: "band",
                          dataKey: "className",
                          tickPlacement: "middle",
                          tickLabelPlacement: "middle",
                        },
                      ]}
                      series={[
                        // {
                        //   dataKey: "numberOfAbsent",
                        //   label: "Lựợt vắng",
                        //   stack: "A",
                        //   valueFormatter,
                        // },
                        {
                          dataKey: "numberOfUnconfirmed",
                          stack: "A",
                          label: "Vắng (K)",
                          // color: "#165C9E",
                          color: "#e91e63",
                          valueFormatter,
                        },
                        {
                          dataKey: "numberOfConfirmed",
                          stack: "A",
                          label: "Vắng (P)",
                          // color: "#A5A5A5",
                          color: "#fb8c00",
                          valueFormatter,
                        },
                      ]}
                      {...chartSetting}
                    />
                  </div>
                  <p className="text-base font-bold mt-6">THỐNG KÊ CHI TIẾT</p>
                  <TableComponent
                    header={[
                      "Lớp",
                      "Khối",
                      "GVCN",
                      "Số lượng HS",
                      "Có mặt",
                      "Vắng (K)",
                      "Vắng (P)",
                      "Tổng lượt vắng",
                    ]}
                    data={currentData?.map((item) => [
                      item.className,
                      item.grade,
                      item.teacher,
                      item.numberOfStudent,
                      item.numberOfPresent,
                      item.numberOfAbsent,
                      item.numberOfConfirmed,
                      item.numberOfAbsent + item.numberOfConfirmed,
                    ])}
                    onDetails={handleDetails}
                    itemsPerPage={30}
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
            <div className="mt-5 text-base">
              <p className="font-bold">Ghi chú:</p>
              <ul className="list-disc ml-5">
                <li>
                  <span className="error-color font-bold">(Vắng (K)): </span>
                  <span className="italic">
                    Tổng tất cả lượt vắng không phép của học sinh trong năm học/tuần học quy định.
                  </span>
                </li>
                <li>
                  <span className="warning-color font-bold">(Vắng (P)): </span>
                  <span className="italic">
                    Tổng tất cả lượt vắng có phép của học sinh trong năm học/tuần học quy định.
                  </span>
                </li>
              </ul>
            </div>
            {data && currentData?.length > 0 ? (
              <PopupComponent
                title="CHI TIẾT"
                description={`NĂM HỌC: ${schoolYear || "chưa có dữ liệu!"} `}
                rightNote={`Lớp: ${currentAttendanceDetail.className || "chưa có dữ liệu!"}`}
                isOpen={openModalDetail}
                onClose={() => setOpenModalDetail(false)}
              >
                <div className="max-w-md">
                  <TextValueComponent
                    label="GVCN"
                    value={currentAttendanceDetail.teacher || "chưa có dữ liệu!"}
                    icon={<PersonIcon />}
                    variantValue="success"
                    className="justify-between w-full"
                  />
                  <TextValueComponent
                    label="Số lượng học sinh"
                    value={
                      `${currentAttendanceDetail.numberOfStudent} học sinh` || "chưa có dữ liệu!"
                    }
                    icon={<GroupsIcon />}
                    customValue="text-black "
                    className="justify-between w-full"
                  />
                  <TextValueComponent
                    label="Có mặt"
                    value={`${currentAttendanceDetail.numberOfPresent} lượt` || "_"}
                    icon={<CheckCircleIcon />}
                    customValue="text-black "
                    className="justify-between w-full"
                  />
                  {/* <TextValueComponent
                    label="Chưa điểm danh"
                    value={`${currentAttendanceDetail.numberOfAbsent} lượt` || "_"}
                    icon={<RemoveCircleOutlineIcon />}
                    customValue="text-black "
                    className="justify-between w-full"
                  /> */}
                  <TextValueComponent
                    label="Vắng (P)"
                    value={`${currentAttendanceDetail.numberOfConfirmed} lượt` || "_"}
                    icon={<HowToRegIcon />}
                    customValue="text-black "
                    className="justify-between w-full"
                  />
                  <TextValueComponent
                    label="Vắng (K)"
                    value={`${currentAttendanceDetail.numberOfAbsent} lượt` || "_"}
                    icon={<DoNotDisturbOffIcon />}
                    customValue="text-black "
                    className="justify-between w-full"
                  />

                  <div className="w-full h-0.5 bg-slate-400 my-2"></div>
                  <TextValueComponent
                    label="Tổng lượt vắng"
                    value={
                      `${
                        currentAttendanceDetail.numberOfAbsent +
                        currentAttendanceDetail.numberOfConfirmed
                      } lượt` || "_"
                    }
                    icon={<AutoStoriesIcon />}
                    variantValue="primary"
                    className="justify-between w-full"
                  />
                </div>
              </PopupComponent>
            ) : (
              ""
            )}
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
