import {
  FormControl,
  InputLabel,
  Card,
  MenuItem,
  Select,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { ToastContainer } from "react-toastify";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LockClockIcon from "@mui/icons-material/LockClock";

import React, { useState, useEffect } from "react";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import { useForm } from "react-hook-form";
import { generateClasses } from "utils/CommonFunctions";
import { useQuery } from "react-query";
import { getAllSubjects } from "services/SubjectService";
import { getMarkOfStudentAllSubject, getMarkOfStudentBySubject } from "../../services/markService";
import TextValueComponent from "../../components/TextValueComponent";
import { renderRankingStyles } from "utils/RenderStyle";
import { renderRanking } from "utils/RenderStyle";
import { TabPanel } from "components/TabPanelComponent";
import { renderAverageMarkStyles } from "utils/RenderStyle";
import { STUDENT_ROLE } from "services/APIConfig";
import TableComponent from "components/TableComponent/TableComponent";

// MarkReportStudent (KhoaTD)
const semesters = [
  { label: "Học kỳ I", value: "Học kỳ I" },
  { label: "Học kỳ II", value: "Học kỳ II" },
  { label: "Cả năm", value: "Cả năm" },
];

let tabs = ["ĐIỂM THEO MÔN", "ĐIỂM TỔNG KẾT"];

export default function MarkReportStudent() {
  const [currentOfStudentsMarkBySubject, setCurrentOfStudentsMarkBySubject] = useState([]);
  const [currentMarkOfClass, setCurrentMarkOfClass] = useState([]);
  const [openModalDetailsAllSubject, setOpenModalDetailsAllSubject] = useState(false);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSchoolSemester(semesters[0].label);
  };

  const [markDetails, setMarkDetails] = useState({});

  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  let accessToken, currentUser, userRole, schoolYearsAPI, classesAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    classesAPI = JSON.parse(localStorage.getItem("currentClasses"));
    currentUser = JSON.parse(localStorage.getItem("user"));
  }

  //call api get all
  const { data, error, isLoading } = useQuery(["subjectState", { accessToken }], () =>
    getAllSubjects(accessToken)
  );

  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const classesOfSchoolYear = generateClasses(classesAPI, schoolYear);
  const [schoolClass, setSchoolClass] = React.useState(classesOfSchoolYear[0]?.Classroom);

  useEffect(() => {
    if (data) {
      setSchoolSubject(data[0].name);
    }
  }, [data]);
  const [schoolSubject, setSchoolSubject] = React.useState("");
  const handleSchoolSubjectSelectedChange = (event) => {
    setSchoolSubject(event.target.value);
  };

  const [schoolSemester, setSchoolSemester] = React.useState(semesters[0].label);
  const handleSemesterChange = (event) => {
    setSchoolSemester(event.target.value);
  };

  const handleDetails = (rowItem) => {
    if (rowItem) {
      setMarkDetails(rowItem);
      setOpenModalDetails(true);
    }
  };

  const {
    data: markOfStudentsBySubject,
    isError: isErrorMark,
    isLoading: isLoadingMark,
    refetch,
  } = useQuery({
    queryKey: ["markOfSubjectOfStudent"],
    queryFn: () =>
      getMarkOfStudentBySubject(accessToken, currentUser?.id, schoolYear, schoolSubject),
    enabled: false,
  });

  const {
    data: markOfClassAllSubject,
    isError: isErrorMarkOfClass,
    isLoading: isLoadingMarkOfClass,
    refetch: refetchMarkOfClass,
  } = useQuery({
    queryKey: ["markOfClassAllSubject", { accessToken, schoolYear, schoolClass }],
    queryFn: () => getMarkOfStudentAllSubject(accessToken, currentUser?.id, schoolYear),
    enabled: false,
  });

  const sortData = (scores) => {
    const keyOrder = ["Miệng", "15p", "1 Tiết", "Cuối kỳ"];
    const semesterOrder = ["Học kỳ I", "Học kỳ II"];

    let sortedScores = scores?.sort((a, b) => {
      if (semesterOrder.indexOf(a.semester) !== semesterOrder.indexOf(b.semester)) {
        return semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester);
      }
      if (keyOrder.indexOf(a.key) !== keyOrder.indexOf(b.key)) {
        return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key);
      }
      return a.indexCol - b.indexCol;
    });
    return sortedScores;
  };

  const handleFilterMark = () => {
    if (value == 0) {
      setSearchLoading(true); // Start loading
      refetch()
        .then((result) => {
          if (result?.data) {
            // Sort the scores for each subject in the result data
            const sortedData = result.data.details.map((detail) => {
              return {
                ...detail,
                scores: sortData(detail.scores),
              };
            });

            setCurrentOfStudentsMarkBySubject({
              ...result.data,
              details: sortedData,
            });
          }
          setSearchLoading(false); // End loading
        })
        .catch(() => {
          setSearchLoading(false); // End loading in case of an error
        });
    } else if (value == 1) {
      setSearchLoading(true); // Start loading
      refetchMarkOfClass()
        .then((result) => {
          if (result?.data) {
            setCurrentMarkOfClass(result?.data);
          }
          setSearchLoading(false); // End loading
        })
        .catch(() => {
          setSearchLoading(false); // End loading in case of an error
        });
    }
  };

  const formattedSubjects = data
    ?.filter((item) => item.isMark)
    ?.map((item) => ({
      label: `${item.name}`,
      name: item.name,
      value: item.name,
      grade: item.grade,
    }))
    .sort((a, b) => a.grade - b.grade); // Sort by grade
  // Filter out duplicates by name
  const uniqueSubjects = [];
  const uniqueNames = new Set();

  formattedSubjects?.forEach((item) => {
    if (!uniqueNames.has(item.name)) {
      uniqueNames.add(item.name);
      uniqueSubjects.push(item);
    }
  });
  const handleDetailsAllSubject = (rowItem) => {
    if (rowItem) {
      setMarkDetails(rowItem);
      setOpenModalDetailsAllSubject(true);
    }
  };

  const getFilteredScores = () => {
    const details = currentOfStudentsMarkBySubject?.details[0];
    if (!details) return [];

    return details.scores.filter((item) => {
      if (schoolSemester === "Học kỳ I") {
        return item.semester === "Học kỳ I";
      } else if (schoolSemester === "Học kỳ II") {
        return item.semester === "Học kỳ II";
      } else if (schoolSemester === "Cả năm") {
        return true;
      }
      return false;
    });
  };

  const roundToNearestTenth = (num) => {
    return Math.round(num * 10) / 10;
  };

  const calculateAverage = (data, semester) => {
    let total = 0;
    let count = 0;

    data.forEach((subject) => {
      let value;
      switch (semester) {
        case "Học kỳ I":
          value = subject.semester1Average;
          break;
        case "Học kỳ II":
          value = subject.semester2Average;
          break;
        case "Cả năm":
          value = subject.yearAverage;
          break;
        default:
          return;
      }

      if (!isNaN(value) && value !== "Đ" && value !== "CĐ") {
        total += parseFloat(value);
        count += 1;
      }
    });

    const average = count === 0 ? 0 : total / count;
    return roundToNearestTenth(average).toFixed(1);
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          {userRole.includes(STUDENT_ROLE) ? (
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
              {tabs.map((item, index) => (
                <Tab key={index} label={item} />
              ))}
            </Tabs>
          ) : (
            ""
          )}

          <div className="flex flex-nowrap justify-between mb-2.5 mt-8">
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
              {userRole.includes(STUDENT_ROLE) && value == 0 ? (
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="select-school-subject-lable">Môn học</InputLabel>
                  <Select
                    labelId="select-school-subject-lable"
                    id="select-school-subject"
                    value={schoolSubject}
                    className="h-10 mr-2 max-[639px]:mb-4"
                    label="Môn học"
                    onChange={handleSchoolSubjectSelectedChange}
                  >
                    {uniqueSubjects?.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
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
                onClick={handleFilterMark}
              >
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
            </div>
          </div>

          <TabPanel value={value} index={0}>
            <>
              {userRole.includes(STUDENT_ROLE) ? (
                <>
                  <div className="text-center mt-10 uppercase">
                    <h4 className="text-xl font-bold max-[639px]:hidden">
                      Bảng điểm {`(${currentUser?.fullname})`}
                    </h4>
                    <h4 className="text-xl font-bold hidden max-[639px]:block">
                      Bảng điểm <br /> {`(${currentUser?.fullname})`}
                    </h4>
                    <h4 className="text-xl font-bold">Năm học {schoolYear}</h4>
                    <h4 className="text-xl font-bold">
                      Môn {schoolSubject}({schoolSemester})
                    </h4>
                  </div>

                  {isLoadingMark || searchLoading ? (
                    <div className="text-center primary-color my-16 text-xl italic font-medium">
                      <div className="mx-auto flex items-center justify-center">
                        <p className="mr-3">Loading</p>
                        <CircularProgress size={24} color="inherit" />
                      </div>
                    </div>
                  ) : currentOfStudentsMarkBySubject?.details?.length > 0 ? (
                    <>
                      <div className="flex flex-nowrap max-[639px]:flex-wrap justify-between icon-custom mt-5">
                        <div className="flex max-[639px]:flex-wrap">
                          <div className="text-sm mr-4 flex">
                            <div className="mr-2">
                              <span className="mr-2 font-bold">Lớp: </span>
                              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                                {currentOfStudentsMarkBySubject?.className || "_"}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm mr-4 flex max-[639px]:my-3">
                            <div className="mr-2">
                              <span className="mr-2 font-bold">Môn: </span>
                              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                                {currentOfStudentsMarkBySubject?.details
                                  ? currentOfStudentsMarkBySubject?.details[0]?.subject
                                  : "_"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="flex items-center">
                            <span className="mr-2 font-bold text-sm">Chọn học kỳ: </span>
                            <FormControl sx={{ minWidth: 120 }}>
                              <InputLabel id="select-school-semester-lable">Học kỳ</InputLabel>
                              <Select
                                labelId="select-school-semester-lable"
                                id="select-school-semester"
                                value={schoolSemester}
                                className="h-10 max-[639px]:mb-4"
                                label="Học kỳ"
                                onChange={handleSemesterChange}
                              >
                                {semesters.map((item, index) => (
                                  <MenuItem key={index} value={item.value}>
                                    {item.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <TableComponent
                        header={["Học kỳ", "Điểm thành phần", "Thứ tự", "Điểm"]}
                        data={getFilteredScores().map((item) => [
                          item.semester,
                          item.key,
                          `Lần ${item.indexCol}`,
                          item.value != -1 ? item.value : "_",
                        ])}
                        itemsPerPage={50}
                        isPaginate={false}
                        onDetails={handleDetails}
                        className="mt-6"
                      />
                      <div className="mt-5 text-base w-full flex justify-end">
                        <div className="max-w-max">
                          {/* <div className="flex justify-between items-center">
                            <span className="font-bold mr-3">Xếp loại: </span>
                            {currentOfStudentsMarkBySubject?.details ? (
                              currentOfStudentsMarkBySubject?.details[0]?.average > 0 ? (
                                <span
                                  className={renderRankingStyles(
                                    currentOfStudentsMarkBySubject?.details[0]?.average
                                  )}
                                >
                                  {renderRanking(
                                    currentOfStudentsMarkBySubject?.details[0]?.average
                                  )}
                                </span>
                              ) : (
                                "Chưa xếp loại"
                              )
                            ) : (
                              "Chưa xếp loại"
                            )}
                          </div> */}
                          <div className="flex justify-between items-center mt-2 pt-2">
                            <span className="font-bold mr-4">Trung bình môn: </span>
                            {currentOfStudentsMarkBySubject?.details ? (
                              currentOfStudentsMarkBySubject?.details[0]?.average > 0 ? (
                                <span
                                  className={renderAverageMarkStyles(
                                    currentOfStudentsMarkBySubject?.details[0]?.average
                                  )}
                                >
                                  {currentOfStudentsMarkBySubject?.details[0]?.average}
                                </span>
                              ) : (
                                "_"
                              )
                            ) : (
                              "_"
                            )}
                          </div>
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
                </>
              ) : (
                ""
              )}
            </>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <>
              <div className="text-center mt-10 uppercase">
                <h4 className="text-xl font-bold max-[639px]:hidden">
                  Bảng điểm {`(${currentUser?.fullname})`}
                </h4>
                <h4 className="text-xl font-bold hidden max-[639px]:block">
                  Bảng điểm <br /> {`(${currentUser?.fullname})`}
                </h4>
                <h4 className="text-xl font-bold">Năm học {schoolYear}</h4>
                <h4 className="text-xl font-bold">{schoolSemester}</h4>
              </div>

              {isLoadingMarkOfClass || searchLoading ? (
                <div className="text-center primary-color my-16 text-xl italic font-medium">
                  <div className="mx-auto flex items-center justify-center">
                    <p className="mr-3">Loading</p>
                    <CircularProgress size={24} color="inherit" />
                  </div>
                </div>
              ) : markOfClassAllSubject && currentMarkOfClass?.length > 0 ? (
                <>
                  <div className="flex flex-nowrap icon-custom mt-5 w-full justify-end">
                    {/* <div className="text-sm mr-4 flex">
                      <div className="mr-2">
                        <span className="mr-2 font-bold">Lớp: </span>
                        <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                          {currentOfStudentsMarkBySubject?.className || "_"}
                        </span>
                      </div>
                    </div> */}
                    <div className="flex items-center">
                      <span className="mr-2 font-bold text-sm">Chọn học kỳ: </span>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="select-school-semester-lable">Học kỳ</InputLabel>
                        <Select
                          labelId="select-school-semester-lable"
                          id="select-school-semester"
                          value={schoolSemester}
                          className="h-10 max-[639px]:mb-2"
                          label="Học kỳ"
                          onChange={handleSemesterChange}
                        >
                          {semesters.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  {schoolSemester != "Cả năm" ? (
                    <>
                      <TableComponent
                        header={["Môn học", "Điểm trung bình"]}
                        data={currentMarkOfClass.map((item) => [
                          item.subject,
                          (schoolSemester == "Học kỳ I" && item.semester1Average > 0) ||
                          (schoolSemester == "Học kỳ I" &&
                            (item.semester1Average == "CĐ" || item.semester1Average == "Đ"))
                            ? item.semester1Average
                            : (schoolSemester == "Học kỳ II" && item.semester2Average > 0) ||
                              (schoolSemester == "Học kỳ II" &&
                                (item.semester2Average == "CĐ" || item.semester2Average == "Đ"))
                            ? item.semester2Average
                            : "_",
                          // schoolSemester == "Học kỳ I" && item.semester1Average > 0
                          //   ? renderRanking(item.semester1Average)
                          //   : schoolSemester == "Học kỳ II" && item.semester2Average > 0
                          //   ? renderRanking(item.semester1Average)
                          //   : "Chưa xếp loại",
                        ])}
                        itemsPerPage={50}
                        isPaginate={false}
                        onDetails={handleDetailsAllSubject}
                        className="mt-6"
                      />
                      <div className="mt-5 text-base w-full flex justify-end">
                        <div className="max-w-max">
                          <div className="flex justify-between items-center">
                            <span className="font-bold mr-3">Xếp loại: </span>
                            {currentMarkOfClass?.length > 0 &&
                            calculateAverage(currentMarkOfClass, schoolSemester) > 0 ? (
                              <span
                                className={renderRankingStyles(
                                  calculateAverage(currentMarkOfClass, schoolSemester)
                                )}
                              >
                                {renderRanking(
                                  calculateAverage(currentMarkOfClass, schoolSemester)
                                )}
                              </span>
                            ) : (
                              "Chưa xếp loại"
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-2 border-t-2 pt-2">
                            <span className="font-bold mr-4">Trung bình môn: </span>
                            {currentMarkOfClass?.length > 0 &&
                            calculateAverage(currentMarkOfClass, schoolSemester) > 0 ? (
                              <span
                                className={renderAverageMarkStyles(
                                  calculateAverage(currentMarkOfClass, schoolSemester)
                                )}
                              >
                                {calculateAverage(currentMarkOfClass, schoolSemester)}
                              </span>
                            ) : (
                              "_"
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <TableComponent
                        header={[
                          "Môn học",
                          "Học kỳ I",
                          "Học kỳ II",
                          "Điểm trung bình",
                          "Xếp loại môn",
                        ]}
                        data={currentMarkOfClass.map((item) => [
                          item.subject,
                          item.semester1Average != -1 ? item.semester1Average : "_",
                          item.semester2Average != -1 ? item.semester2Average : "_",
                          item.yearAverage != -1 ? item.yearAverage : "_",
                          item.yearAverage != -1
                            ? renderRanking(item.yearAverage)
                            : "Chưa xếp loại",
                        ])}
                        itemsPerPage={50}
                        isPaginate={false}
                        onDetails={handleDetailsAllSubject}
                        className="mt-6"
                      />
                      <div className="mt-5 text-base w-full flex justify-end">
                        <div className="max-w-max">
                          <div className="flex justify-between items-center">
                            <span className="font-bold">Xếp loại: </span>
                            {currentMarkOfClass?.length > 0 &&
                            calculateAverage(currentMarkOfClass, "Cả năm") > 0 ? (
                              <span
                                className={renderRankingStyles(
                                  calculateAverage(currentMarkOfClass, "Cả năm")
                                )}
                              >
                                {renderRanking(calculateAverage(currentMarkOfClass, "Cả năm"))}
                              </span>
                            ) : (
                              "Chưa xếp loại"
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-2 border-t-2 pt-2">
                            <span className="font-bold mr-4">Trung bình môn (Kỳ I): </span>
                            {currentMarkOfClass?.length > 0 &&
                            calculateAverage(currentMarkOfClass, "Học kỳ I") > 0
                              ? calculateAverage(currentMarkOfClass, "Học kỳ I")
                              : "_"}
                          </div>
                          <div className="flex justify-between items-center mt-2 border-t-2 pt-2">
                            <span className="font-bold mr-4">Trung bình môn (Kỳ II): </span>
                            {currentMarkOfClass?.length > 0 &&
                            calculateAverage(currentMarkOfClass, "Học kỳ II") > 0
                              ? calculateAverage(currentMarkOfClass, "Học kỳ II")
                              : "_"}
                          </div>
                          <div className="flex justify-between items-center mt-2 border-t-2 pt-2">
                            <span className="font-bold mr-4">Trung bình môn (Cả năm): </span>
                            {currentMarkOfClass?.length > 0 &&
                            calculateAverage(currentMarkOfClass, "Cả năm") > 0 ? (
                              <span
                                className={renderAverageMarkStyles(
                                  calculateAverage(currentMarkOfClass, "Cả năm")
                                )}
                              >
                                {calculateAverage(currentMarkOfClass, "Cả năm")}
                              </span>
                            ) : (
                              "_"
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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
            </>
          </TabPanel>
          <div className="mt-5 text-base">
            <p className="font-bold">Ghi chú:</p>
            <ul className="list-disc ml-5">
              <li>
                <span className="font-bold">(-): </span>
                <span className="italic">Chưa có điểm, giáo viên chưa nhập điểm cho cột này.</span>
              </li>
              <li>
                <span className="black font-medium italic">(Chưa xếp loại): </span>
                <span className="italic">Học sinh chưa được xếp loại trong kỳ học.</span>
              </li>
              <li>
                <span className="success-color font-medium italic">(Giỏi): </span>
                <span className="italic">Học sinh đạt điểm trung bình học kỳ loại giỏi.</span>
              </li>
              <li>
                <span className="primary-color font-medium italic">(Khá): </span>
                <span className="italic">Học sinh đạt điểm trung bình học kỳ loại khá.</span>
              </li>
              <li>
                <span className="warning-color font-medium italic">(Trung bình): </span>
                <span className="italic">Học sinh đạt điểm trung bình học kỳ loại trung bình.</span>
              </li>
              <li>
                <span className="error-color font-medium italic">(Yếu): </span>
                <span className="italic">Học sinh đạt điểm trung bình học kỳ loại yếu.</span>
              </li>
            </ul>
          </div>
          <PopupComponent
            title="CHI TIẾT ĐIỂM"
            description="Chi tiết các cột điểm môn học"
            rightNote={`HS: ${currentOfStudentsMarkBySubject?.fullName}`}
            isOpen={openModalDetails}
            onClose={() => setOpenModalDetails(false)}
          >
            <div>
              <div className="flex justify-between bg-primary-color text-white rounded-sm italic px-2 text-sm py-1 mb-1">
                <span>
                  <AssignmentIcon className="mb-0.5" /> {markDetails[1]}
                </span>
                <span>{schoolSemester != "Cả năm" ? schoolSemester : markDetails[0]}</span>
              </div>
              <TextValueComponent
                label={`${markDetails[2]}`}
                key={markDetails[0]}
                className="px-4 justify-between justify-between"
                value={`${markDetails[3] > 0 ? `${markDetails[3]} điểm` : "_"}`}
                icon={<LockClockIcon />}
              />
            </div>
          </PopupComponent>
          <PopupComponent
            title="CHI TIẾT ĐIỂM"
            description="Chi tiết điểm"
            rightNote={`HS: ${currentUser?.fullname}`}
            isOpen={openModalDetailsAllSubject}
            onClose={() => setOpenModalDetailsAllSubject(false)}
          >
            {schoolSemester != "Cả năm" ? (
              <div>
                <div className="flex justify-between bg-primary-color text-white rounded-sm italic px-2 text-sm py-1 mb-1">
                  <span>
                    <AssignmentIcon className="mb-0.5" /> {markDetails[0]}
                  </span>
                  <span>TBM</span>
                </div>
                <TextValueComponent
                  label={`${schoolSemester}`}
                  key={markDetails[0]}
                  className="px-4 justify-between justify-between"
                  value={`${markDetails[1] > 0 ? `${markDetails[1]} điểm` : "_"}`}
                  icon={<LockClockIcon />}
                />
                <div className="flex justify-end mt-4 border-t-2 pt-3">
                  {/* <div>
                    <span className="font-bold">Xếp loại: </span>
                    {markDetails[1] > 0 ? (
                      <span className={renderRankingStyles(markDetails[1])}> {markDetails[1]}</span>
                    ) : (
                      "Chưa xếp loại"
                    )}
                  </div> */}
                  <div>
                    <span className="font-bold">TMB: </span>
                    {markDetails[1] > 0 ? (
                      <span className={renderAverageMarkStyles(markDetails[1])}>
                        {markDetails[1]}
                      </span>
                    ) : (
                      "_"
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between bg-primary-color text-white rounded-sm italic px-2 text-sm py-1 mb-1">
                  <span>
                    <AssignmentIcon className="mb-0.5" /> {markDetails[0]}
                  </span>
                  <span>TBM</span>
                </div>
                <TextValueComponent
                  label={`Học kỳ I`}
                  key={markDetails[1]}
                  className="px-4 justify-between justify-between"
                  value={`${markDetails[1] > 0 ? `${markDetails[1]} điểm` : "_"}`}
                  icon={<LockClockIcon />}
                />
                <TextValueComponent
                  label={`Học kỳ II`}
                  key={markDetails[2]}
                  className="px-4 justify-between justify-between"
                  value={`${markDetails[2] > 0 ? `${markDetails[2]} điểm` : "_"}`}
                  icon={<LockClockIcon />}
                />
                <TextValueComponent
                  label={`Cả năm`}
                  key={markDetails[3]}
                  className="px-4 justify-between justify-between"
                  value={`${markDetails[3] > 0 ? `${markDetails[3]} điểm` : "_"}`}
                  icon={<LockClockIcon />}
                />
                <div className="flex justify-between mt-4 border-t-2 pt-3">
                  <div>
                    <span className="font-bold">Xếp loại: </span>
                    {markDetails[4] > 0 ? (
                      <span className={renderRankingStyles(markDetails[3])}> {markDetails[4]}</span>
                    ) : (
                      "Chưa xếp loại"
                    )}
                  </div>
                  <div>
                    <span className="font-bold">TMB: </span>
                    {markDetails[3] > 0 ? (
                      <span className={renderAverageMarkStyles(markDetails[3])}>
                        {markDetails[3]}
                      </span>
                    ) : (
                      "_"
                    )}
                  </div>
                </div>
              </div>
            )}
          </PopupComponent>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
