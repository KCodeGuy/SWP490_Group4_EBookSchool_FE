import {
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { BarChart, axisClasses } from "@mui/x-charts";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import MDBox from "components/MDBox";
import { TabPanel } from "components/TabPanelComponent";
import TableComponent from "components/TableComponent/TableComponent";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Footer from "examples/Footer";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import { useQuery } from "react-query";

import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { isTodayInSchoolYear } from "../../utils/CommonFunctions";
import { getWeekForDate } from "../../utils/CommonFunctions";
import { generateSchoolWeeks } from "../../utils/CommonFunctions";
import { getTodayDate } from "../../utils/CommonFunctions";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TextValueComponent from "../../components/TextValueComponent";
import {
  statisticOfRegisterNotebook,
  statisticOfRegisterNotebookByGrade,
  statisticOfRegisterNotebookByGradeWholeYear,
  statisticOfRegisterNotebookWholeYear,
} from "../../services/StatisticService";
import { position } from "stylis";

const grades = [12, 11, 10];
const MARK_OF_TYPE_A = 20;
const MARK_OF_TYPE_B = 15;
const MARK_OF_TYPE_C = 10;
const MARK_OF_TYPE_D = 0;

export default function RegisterNotebookStatistics() {
  let accessToken, userRole, schoolYearsAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
  }

  const [currentData, setCurrentData] = useState([]);
  const [detail, setDetail] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [highestMark, setHighestMark] = useState({ mark: 0, class: "Chưa thống kê!" });
  const [lowestMark, setLowerMark] = useState({ mark: 0, class: "Chưa thống kê!" });
  const [averageMark, setAverageMark] = useState(0);
  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const { today } = getTodayDate();
  const schoolWeeks = generateSchoolWeeks(schoolYear);

  let currentWeek;
  if (isTodayInSchoolYear(schoolYear)) {
    currentWeek = getWeekForDate(schoolWeeks, today);
  }

  const [currentWeekDate, setCurrentWeekDate] = useState(currentWeek);

  const [schoolWeek, setSchoolWeek] = React.useState(currentWeekDate?.startTime);
  const [schoolWeekEnd, setSchoolWeekEnd] = React.useState(currentWeekDate?.endTime);
  const handleSchoolWeeksSelectedChange = (event) => {
    const selectedWeek = schoolWeeks.find((item) => item.startTime === event.target.value);
    setSchoolWeek(event.target.value);
    setSchoolWeekEnd(selectedWeek.endTime);
  };

  const [grade, setGrade] = React.useState(grades[0]);
  const handleGradeSelectedChange = (event) => {
    setGrade(event.target.value);
  };

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["registerNotebookStatistic", { accessToken, schoolYear, schoolWeek, schoolWeekEnd }],
    queryFn: () => statisticOfRegisterNotebook(accessToken, schoolYear, schoolWeek, schoolWeekEnd),
    enabled: false,
  });

  const {
    data: dataWholeYear,
    isLoading: isLoadingWholeYear,
    refetch: refetchWholeYear,
  } = useQuery({
    queryKey: ["registerNotebookStatisticWholeYear", { accessToken, schoolYear }],
    queryFn: () => statisticOfRegisterNotebookWholeYear(accessToken, schoolYear),
    enabled: false,
  });

  const {
    data: dataByGrade,
    isLoading: isLoadingByGrade,
    refetch: refetchByGrade,
  } = useQuery({
    queryKey: [
      "registerNotebookStatisticByGrade",
      { accessToken, schoolYear, schoolWeek, schoolWeekEnd, grade },
    ],
    queryFn: () =>
      statisticOfRegisterNotebookByGrade(accessToken, schoolYear, schoolWeek, schoolWeekEnd, grade),
    enabled: false,
  });

  const {
    data: dataByGradeWholeYear,
    isLoading: isLoadingByGradeWholeYear,
    refetch: refetchByGradeWholeYear,
  } = useQuery({
    queryKey: ["registerNotebookStatisticByGradeWholeYear", { accessToken, schoolYear, grade }],
    queryFn: () => statisticOfRegisterNotebookByGradeWholeYear(accessToken, schoolYear, grade),
    enabled: false,
  });

  const handleDetails = (rowItem) => {
    if (rowItem) {
      // console.log(rowItem);
      setOpenModalDetail(true);
      const itemDetail = {
        className: rowItem[0],
        typeA: rowItem[1],
        typeB: rowItem[2],
        typeC: rowItem[3],
        typeD: rowItem[4],
        totalMark: rowItem[5],
        rank: rowItem[6],
      };
      setDetail(itemDetail);
    }
  };

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setCurrentData([]);
  };

  const tabLabels = ["ĐIỂM SĐB TOÀN TRƯỜNG", "ĐIỂM SĐB THEO KHỐI"];

  const handleStatisticWeekly = () => {
    setSearchLoading(true); // End loading
    refetch()
      .then((result) => {
        if (result.data) {
          const { transformedData } = transformData(result.data);
          setCurrentData(transformedData);
        }
        setSearchLoading(false); // End loading
      })
      .catch(() => {
        setSearchLoading(false); // End loading in case of an error
      });
  };

  const handleStatisticWholeYear = () => {
    setSearchLoading(true); // End loading
    refetchWholeYear()
      .then((result) => {
        if (result.data) {
          const { transformedData } = transformData(result.data);
          setCurrentData(transformedData);
        }
        setSearchLoading(false); // End loading
      })
      .catch(() => {
        setSearchLoading(false); // End loading in case of an error
      });
  };

  const handleStatisticWeeklyByGrade = () => {
    refetchByGrade().then((result) => {
      if (result.data) {
        const { transformedData } = transformData(result.data);
        setCurrentData(transformedData);
      }
    });
  };

  const handleStatisticWeeklyByGradeWholeYear = () => {
    refetchByGradeWholeYear().then((result) => {
      if (result.data) {
        const { transformedData } = transformData(result.data);
        setCurrentData(transformedData);
      }
    });
  };

  const aSchoolBookForAGradeBox = [
    {
      color: "success",
      icon: "leaderboard",
      title: "Điểm cao nhất",
      count: `${highestMark?.mark} điểm`,
      textDescriptionColor: "success",
      amount: `Lớp ${highestMark?.class}`,
      label: "có tổng điểm cao nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Điểm trung bình",
      count: `${averageMark} điểm`,
      textDescriptionColor: "info",
      amount: `${averageMark} điểm`,
      label: "Điểm TB giữa tất cả các lớp",
    },
    {
      color: "primary",
      icon: "leaderboard",
      title: "Điểm thấp nhất",
      count: `${lowestMark?.mark} điểm`,
      textDescriptionColor: "primary",
      amount: `Lớp ${lowestMark?.class}`,
      label: "có tổng điểm thấp nhất",
    },
    {
      color: "info",
      icon: "leaderboard",
      title: "Tổng số lớp",
      count: `${currentData?.length} lớp` || 0,
      textDescriptionColor: "info",
      amount: `${currentData?.length} lớp` || 0,
      label: "là tổng số lượng lớp",
    },
  ];

  (React.useState < "middle") | ("tick" > "middle");

  function transformData(data) {
    if (data.length > 0) {
      const defaultRankKeys = ["A", "B", "C", "D"];

      // Extract total marks, calculate totalMark and add default values
      data.forEach((item) => {
        item.rankCounts.remainderSlot = item.rankCounts[""];
        delete item.rankCounts[""];

        // Ensure default values for C and D
        defaultRankKeys.forEach((key) => {
          if (!item.rankCounts.hasOwnProperty(key)) {
            item.rankCounts[key] = 0;
          }
        });

        // Calculate totalMark
        item.rankCounts.totalMark =
          item.rankCounts.A * MARK_OF_TYPE_A +
          item.rankCounts.B * MARK_OF_TYPE_B +
          item.rankCounts.C * MARK_OF_TYPE_C;
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

      // Transform data into the desired format for chart
      const chartFormattedData = data.map((item) => ({
        Điểm: item.rankCounts.totalMark,
        Lớp: `Lớp ${item.className}`,
      }));

      // Sort chartFormattedData by totalMark in ascending order
      chartFormattedData.sort((a, b) => a.Điểm - b.Điểm);

      const totalMarks = data.reduce((sum, item) => sum + item.rankCounts.totalMark, 0);
      const averageMark = Math.round(totalMarks / data.length);
      setAverageMark(averageMark);

      return {
        transformedData: data,
        chartFormattedData,
      };
    }
    return {
      transformedData: [],
      chartFormattedData: [],
    };
  }
  const chartSetting = {
    yAxis: [
      {
        label: "Điểm số",
      },
    ],
    height: 500,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
      },
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          <div className="w-full">
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
              <div className="w-full flex justify-between flex-wrap">
                <div className="">
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

                  <ButtonComponent
                    type="success"
                    className="max-[639px]:w-full"
                    onClick={handleStatisticWeekly}
                  >
                    <FilterAltIcon className="mr-1" /> THỐNG KÊ
                  </ButtonComponent>
                </div>
                <div className="max-[660px]:mt-3 max-[639px]:w-full">
                  <ButtonComponent
                    type="primary"
                    className="max-[639px]:w-full "
                    onClick={handleStatisticWholeYear}
                  >
                    <FilterAltIcon className="mr-1" /> CẢ NĂM
                  </ButtonComponent>
                </div>
              </div>

              <>
                <div className="text-center mt-8">
                  <h4 className="text-xl font-bold uppercase">Thống kê sổ đầu bài</h4>
                  <h4 className="text-xl font-bold uppercase">Năm học {schoolYear}</h4>
                </div>

                <div className="mt-8 custom-table">
                  {isLoading || isLoadingWholeYear || searchLoading ? (
                    <div className="text-center primary-color py-20 text-xl italic font-medium">
                      <div className="mx-auto flex items-center justify-center">
                        <p className="mr-3">Loading</p>
                        <CircularProgress size={24} color="inherit" />
                      </div>
                    </div>
                  ) : data && currentData?.length > 0 ? (
                    <>
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
                      {currentData[0]?.rankCounts?.totalMark > 0 ? (
                        <div
                          className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                          style={{ background: "#E9F7FF" }}
                        >
                          <BarChart
                            dataset={currentData?.map((item) => ({
                              className: item.className,
                              totalMark: item.rankCounts.totalMark,
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
                              {
                                dataKey: "totalMark",
                                label: "Điểm số",
                                color: "#165C9E",
                              },
                            ]}
                            {...chartSetting}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <p className="text-base font-bold mt-5">
                        THỐNG KÊ CHI TIẾT NĂM HỌC({schoolYear})
                      </p>
                      <TableComponent
                        header={[
                          "Lớp",
                          "Loại A",
                          "Loại B",
                          "Loại C",
                          "Loại D",
                          "Tổng điểm",
                          "Hạng",
                        ]}
                        data={currentData?.map((item) => [
                          item.className,
                          item.rankCounts.A,
                          item.rankCounts.B,
                          item.rankCounts.C,
                          item.rankCounts.D,
                          item.rankCounts.totalMark,
                          item.rankCounts.rank,
                        ])}
                        itemsPerPage={30}
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
              </>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="w-full flex justify-between flex-wrap">
                <div>
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
                      id="select-school-grade"
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
                    onClick={handleStatisticWeeklyByGrade}
                  >
                    <FilterAltIcon className="mr-1" /> THỐNG KÊ
                  </ButtonComponent>
                </div>
                <div className="max-[786px]:mt-3 max-[639px]:w-full">
                  <ButtonComponent
                    type="primary"
                    className="max-[639px]:w-full"
                    onClick={handleStatisticWeeklyByGradeWholeYear}
                  >
                    <FilterAltIcon className="mr-1" /> CẢ NĂM
                  </ButtonComponent>
                </div>
              </div>
              <>
                <div className="text-center mt-8">
                  <h4 className="text-xl font-bold uppercase">Thống kê sổ đầu bài</h4>
                  <h4 className="text-xl font-bold uppercase">Năm học {schoolYear}</h4>
                  <h4 className="text-xl font-bold uppercase">Khối {grade}</h4>
                </div>

                <div className="mt-8 custom-table">
                  {isLoadingByGrade || isLoadingByGradeWholeYear ? (
                    <div className="text-center primary-color py-20 text-xl italic font-medium">
                      <div className="mx-auto flex items-center justify-center">
                        <p className="mr-3">Loading</p>
                        <CircularProgress size={24} color="inherit" />
                      </div>
                    </div>
                  ) : (dataByGrade || dataByGradeWholeYear) && currentData.length > 0 ? (
                    <>
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
                      {currentData[0].rankCounts.totalMark > 0 ? (
                        <div
                          className="mt-8 w-full p-3 rounded-md shadow-md max-[639px]:overflow-x-scroll sm:overflow-auto"
                          style={{ background: "#E9F7FF" }}
                        >
                          <BarChart
                            dataset={currentData.map((item) => ({
                              className: item.className,
                              typeA: item.rankCounts.A,
                              typeB: item.rankCounts.B,
                              typeC: item.rankCounts.C,
                              typeD: item.rankCounts.D,
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
                              {
                                dataKey: "typeA",
                                stack: "A",
                                label: "Loại A",
                                color: "#165C9E",
                              },
                              {
                                dataKey: "typeB",
                                stack: "A",
                                label: "Loại B",
                                color: "#A5A5A5",
                              },
                              {
                                dataKey: "typeC",
                                stack: "A",
                                label: "Loại C",
                                color: "#F9C559",
                              },
                              {
                                dataKey: "typeD",
                                stack: "A",
                                label: "Loại D",
                                color: "#D70200",
                              },
                            ]}
                            {...chartSetting}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <p className="text-base font-bold mt-5">THỐNG KÊ CHI TIẾT</p>
                      <TableComponent
                        header={[
                          "Lớp",
                          "Loại A",
                          "Loại B",
                          "Loại C",
                          "Loại D",
                          "Tổng điểm",
                          "Xếp hạng",
                        ]}
                        data={currentData?.map((item) => [
                          item.className,
                          item.rankCounts.A,
                          item.rankCounts.B,
                          item.rankCounts.C,
                          item.rankCounts.D,
                          item.rankCounts.totalMark,
                          item.rankCounts.rank,
                        ])}
                        itemsPerPage={30}
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
              </>
            </TabPanel>
            <div className="mt-5 text-base">
              <p className="font-bold">Ghi chú:</p>
              <ul className="list-disc ml-5">
                <li>
                  <span className="primary-color font-bold">(Loại A): </span>
                  <span className="italic">Tiết tích cực, tốt ({MARK_OF_TYPE_A} điểm/tiết.)</span>
                </li>
                <li>
                  <span className="text-color font-bold">(Loại B): </span>
                  <span className="italic">Tiết học khá ({MARK_OF_TYPE_B} điểm/tiết.)</span>
                </li>
                <li>
                  <span className="warning-color font-bold">(Loại C): </span>
                  <span className="italic">Tiết trung bình ({MARK_OF_TYPE_C} điểm/tiết.).</span>
                </li>
                <li>
                  <span className="error-color font-bold">(Loại D): </span>
                  <span className="italic">Tiết học yếu ({MARK_OF_TYPE_D} điểm/tiết.).</span>
                </li>
              </ul>
            </div>
            {currentData.length > 0 ? (
              <PopupComponent
                title="CHI TIẾT"
                description={`NĂM HỌC: ${schoolYear || "chưa có dữ liệu!"} `}
                rightNote={`Lớp: ${detail.className || "chưa có dữ liệu!"}`}
                isOpen={openModalDetail}
                onClose={() => setOpenModalDetail(false)}
              >
                <div className="max-w-md">
                  <TextValueComponent
                    label={`Loại A (${detail.typeA} * ${MARK_OF_TYPE_A})`}
                    value={`${detail.typeA * MARK_OF_TYPE_A} điểm` || "_"}
                    icon={<BorderColorIcon />}
                    className="justify-between w-full"
                  />
                  <TextValueComponent
                    label={`Loại B (${detail.typeB} * ${MARK_OF_TYPE_B})`}
                    value={`${detail.typeB * MARK_OF_TYPE_B} điểm` || "_"}
                    icon={<BorderColorIcon />}
                    className="justify-between w-full"
                  />
                  <TextValueComponent
                    label={`Loại C (${detail.typeC} * ${MARK_OF_TYPE_C})`}
                    value={`${detail.typeC * MARK_OF_TYPE_C} điểm` || "_"}
                    icon={<BorderColorIcon />}
                    className="justify-between w-full"
                  />
                  <TextValueComponent
                    label={`Loại D (${detail.typeD})`}
                    value={`${detail.typeD} điểm` || "_"}
                    icon={<BorderColorIcon />}
                    className="justify-between w-full"
                  />

                  <div className="w-full h-0.5 bg-slate-400 my-2"></div>
                  <div className="flex justify-between text-base mt-3  pt-2">
                    <div>
                      <span className="font-bold">Xếp hạng: </span>
                      <span className="mx-auto text-center text-white px-3 py-1 rounded bg-primary-color">
                        {detail.rank || "_"}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">Tổng điểm: </span>
                      <span className="mx-auto text-center text-white px-3 py-1 rounded bg-primary-color">
                        {`${detail.totalMark} điểm`}
                      </span>
                    </div>
                  </div>
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
