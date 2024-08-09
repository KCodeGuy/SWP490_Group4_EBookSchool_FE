import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import DoNotDisturbOffIcon from "@mui/icons-material/DoNotDisturbOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useQuery } from "react-query";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TextValueComponent from "../../components/TextValueComponent";
import { getAttendanceByStudentAllSubject } from "services/AttendanceService";
import { getAttendanceByStudent } from "services/AttendanceService";

export default function AttendanceReportStudent() {
  const [currentData, setCurrentData] = useState([]);
  const [currentAttendanceDetail, setCurrentAttendanceDetail] = useState({});
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  let accessToken, userRole, schoolYearsAPI, currentUser;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    currentUser = JSON.parse(localStorage.getItem("user"));
  }

  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [currentSubject, setCurrentSubject] = useState("");
  const [currentAttendanceBySubject, setCurrentAttendanceBySubject] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["GetAttendanceByStudentAllSubject"],
    queryFn: () => getAttendanceByStudentAllSubject(accessToken, currentUser?.id, schoolYear),
    enabled: false,
  });

  const {
    data: dataSubject,
    isLoading: isLoadingSubject,
    refetch: refetchSubject,
  } = useQuery({
    queryKey: ["getAttendanceByStudentBySubject"],
    queryFn: () => getAttendanceByStudent(accessToken, currentUser?.id, schoolYear, currentSubject),
    enabled: false,
  });

  const handleDetails = (rowItem) => {
    if (rowItem) {
      setOpenModalDetail(true);
      setCurrentSubject(rowItem[0]);
      const attendanceDetail = {
        subject: rowItem[0],
        present: rowItem[1],
        confirmed: rowItem[2],
        unconfirmed: rowItem[3],
        notStarted: rowItem[4],
        startDate: rowItem[5],
        endDate: rowItem[6],
        absentPercent: rowItem[7],
      };
      setCurrentAttendanceDetail(attendanceDetail);
      refetchSubject().then((result) => {
        if (result.data) {
          setCurrentAttendanceBySubject(result.data);
        }
      });
    }
  };

  const keyMapping = {
    "Có mặt": "present",
    "Vắng không phép": "unconfirmed",
    "Vắng có phép": "confirmed",
    "Chưa bắt đầu": "notStarted",
    "Ngày bắt đầu": "startDate",
    "Ngày kết thúc": "endDate",
  };

  const translateKeys = (data) => {
    return Object.entries(data).map(([subject, details]) => {
      const translatedDetails = {};
      for (const [key, value] of Object.entries(details)) {
        const newKey = keyMapping[key] || key;
        translatedDetails[newKey] = value;
      }
      return {
        subject,
        ...translatedDetails,
      };
    });
  };

  const handleStatisticByWeekly = () => {
    setSearchLoading(true); // Start loading
    refetch()
      .then((result) => {
        if (result.data) {
          const formattedData = translateKeys(result.data);
          setCurrentData(formattedData);
        }
        setSearchLoading(false); // End loading
      })
      .catch(() => {
        setSearchLoading(false); // End loading in case of an error
      });
  };

  const roundToNearestTenth = (num) => {
    return Math.round(num * 10) / 10;
  };

  (React.useState < "middle") | ("tick" > "middle");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="w-full">
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

                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleStatisticByWeekly}
                >
                  <FilterAltIcon className="mr-1" /> TÌM KIẾM
                </ButtonComponent>
              </div>
            </div>
            <div className="mt-8 custom-table">
              <div className="text-center mt-10 uppercase">
                <h4 className="text-xl font-bold">
                  Báo cáo lượt vắng {`(${currentUser?.fullname})`}
                </h4>
                <h4 className="text-xl font-bold">Năm học {schoolYear}</h4>
              </div>
              {isLoading || searchLoading ? (
                <div className="text-center primary-color py-20 text-xl italic font-medium my-10">
                  <div className="mx-auto flex items-center justify-center">
                    <p className="mr-3">Loading</p>
                    <CircularProgress size={24} color="inherit" />
                  </div>
                </div>
              ) : data && currentData?.length > 0 ? (
                <>
                  <TableComponent
                    header={[
                      "Môn",
                      "Có mặt",
                      "Vắng(P)",
                      "Vắng(K)",
                      "Chưa bắt đầu",
                      "Ngày bắt đầu",
                      "Ngày kết thúc",
                      "Tỉ lệ vắng",
                    ]}
                    data={currentData?.map((item) => [
                      item.subject,
                      item.present >= 0 ? item.present : "_",
                      item.confirmed >= 0 ? item.confirmed : "_",
                      item.unconfirmed >= 0 ? item.unconfirmed : "_",
                      item.notStarted >= 0 ? item.notStarted : "_",
                      item.startDate,
                      item.endDate,
                      `${roundToNearestTenth(
                        ((item.confirmed + item.unconfirmed) /
                          (item.present + item.confirmed + item.unconfirmed + item.notStarted)) *
                          100
                      )} %`,
                    ])}
                    onDetails={handleDetails}
                    itemsPerPage={200}
                    isPaginate={false}
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
            {currentData?.length > 0 && currentAttendanceBySubject?.length > 0 ? (
              <PopupComponent
                title="CHI TIẾT"
                description={`NĂM HỌC: ${schoolYear || "_"} `}
                rightNote={`Môn học: ${currentAttendanceDetail?.subject || "_"}`}
                isOpen={openModalDetail}
                onClose={() => {
                  setOpenModalDetail(false);
                  setCurrentAttendanceBySubject([]);
                }}
              >
                {isLoading ||
                searchLoading ||
                isLoadingSubject ||
                currentAttendanceBySubject?.length <= 0 ||
                !currentAttendanceDetail ? (
                  <div className="text-center primary-color py-20 text-xl italic font-medium my-10">
                    <div className="mx-auto flex items-center justify-center">
                      <p className="mr-3">Loading</p>
                      <CircularProgress size={24} color="inherit" />
                    </div>
                  </div>
                ) : currentAttendanceBySubject?.length > 0 ? (
                  <>
                    <div className="w-full">
                      <TextValueComponent
                        label="Tổng số tiết"
                        value={`${currentAttendanceBySubject?.length} tiết` || "_"}
                        icon={<AutoStoriesIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />
                      <TextValueComponent
                        label="Chưa bắt đầu"
                        value={`${currentAttendanceDetail?.notStarted} tiết` || "_"}
                        icon={<DoNotDisturbOffIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />
                      <TextValueComponent
                        label="Có mặt"
                        value={`${currentAttendanceDetail?.present} lượt` || "_"}
                        icon={<CheckCircleIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />
                      <TextValueComponent
                        label="Vắng (P)"
                        value={`${currentAttendanceDetail?.confirmed} lượt` || "_"}
                        icon={<HowToRegIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />
                      <TextValueComponent
                        label="Vắng (K)"
                        value={`${currentAttendanceDetail?.unconfirmed} lượt` || "_"}
                        icon={<DoNotDisturbOffIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />

                      <TextValueComponent
                        label="Ngày bắt đầu"
                        value={`${currentAttendanceDetail?.startDate}` || "_"}
                        icon={<EventAvailableIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />
                      <TextValueComponent
                        label="Ngày kết thúc"
                        value={`${currentAttendanceDetail?.endDate}` || "_"}
                        icon={<EventAvailableIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />
                      <TextValueComponent
                        label="Tỉ lệ vắng"
                        value={`${currentAttendanceDetail?.absentPercent}` || "_"}
                        icon={<LeaderboardIcon />}
                        customValue="text-black "
                        className="justify-between w-full"
                      />

                      <div className="w-full h-0.5 bg-slate-400 my-3"></div>
                      <TextValueComponent
                        label="Tổng lượt vắng"
                        value={
                          `${
                            currentAttendanceDetail.confirmed + currentAttendanceDetail.unconfirmed
                          } lượt` || "_"
                        }
                        icon={<AutoStoriesIcon />}
                        variantValue="primary"
                        className="justify-between w-full"
                      />
                    </div>
                    <div>
                      <p className="text-base font-bold mt-4">
                        CHI TIẾT LƯỢT VẮNG ({`${currentAttendanceBySubject[0]?.subject}`})
                      </p>
                      <TableComponent
                        header={["Tiết", "Ngày", "Giáo viên", "Môn", "Trạng thái", "Ghi chú"]}
                        data={currentAttendanceBySubject?.map((item) => [
                          item.slot,
                          item.date,
                          item.teacher,
                          item.subject,
                          item.status,
                          item.note,
                        ])}
                        isOrdered={false}
                        itemsPerPage={200}
                        className="mt-4"
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
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
