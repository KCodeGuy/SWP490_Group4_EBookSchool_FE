import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import LockClockIcon from "@mui/icons-material/LockClock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

import TableWeeklyTimeTableComponent from "../../components/TableWeeklyTimeTable";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import TextValueComponent from "../../components/TextValueComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { studentClasses } from "../../mock/class";
import { schoolYears } from "../../mock/schoolYear";
import { studentWeeklyTimeTableDates, timeTablesAllSchool } from "../../mock/weeklyTimeTable";
import { getStudentTimetable } from "services/TimeTableService";
import { useMutation, useQuery } from "react-query";
import { generateSchoolWeeks } from "utils/CommonFunctions";
import { getTodayDate } from "utils/CommonFunctions";
import { isTodaySunday } from "utils/CommonFunctions";
import { getWeekForDate } from "utils/CommonFunctions";

// Example usage
const currentYear = new Date().getFullYear();
const schoolWeeks = generateSchoolWeeks(currentYear);

const weeks2024 = generateSchoolWeeks(currentYear);
const { formattedDate, today } = getTodayDate();

const currentWeek = getWeekForDate(schoolWeeks, today);

const formattedSemester = [
  { label: "Học kì 1", value: "HK1" },
  { label: "Học kì 2", value: "HK2" },
  { label: "Cả năm", value: "Cả năm" },
];

let totalSlots = 16;

export default function WeeklyTimeTable() {
  const [openModelAdd, setOpenModelAdd] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({});
  const [currentRoom, setCurrentClass] = useState("12A1");
  const [currentSlotDate, setCurrentSlotDate] = useState("");
  const [currentWeekDate, setCurrentWeekDate] = useState(currentWeek);
  console.log(currentWeekDate);

  const timeTableOfAllSchool = timeTablesAllSchool.data.map((item) => [
    // item.id,
    item.schoolYear,
    item.semester,
    item.class,
    item.mainTeacher,
    item.fromDate,
    item.toDate,
  ]);

  const [schoolWeek, setSchoolWeek] = React.useState(currentWeekDate.startTime);
  const handleSchoolWeeksSelectedChange = (event) => {
    setSchoolWeek(event.target.value);
  };

  const studentID = "HS0001";
  const year = "2023-2024";
  const accessToken =
    "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IkdWMDAwNCIsImp0aSI6ImU0Nzc0Mzk0LTE4MmUtNDU3OS1hYTJhLWQzYTg3NmFkZGUzYiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJBZGQgVGVhY2hlciIsIlVwZGF0ZSBUZWFjaGVyIiwiRGVsZXRlIFRlYWNoZXIiLCJHZXQgVGVhY2hlciIsIkFkZCBTdHVkZW50IiwiVXBkYXRlIFN0dWRlbnQiLCJEZWxldGUgU3R1ZGVudCIsIkdldCBTdHVkZW50IiwiQWRkIFN1YmplY3QiLCJVcGRhdGUgU3ViamVjdCIsIkRlbGV0ZSBTdWJqZWN0IiwiR2V0IFN1YmplY3QiLCJBZGQgQ2xhc3MiLCJVcGRhdGUgQ2xhc3MiLCJEZWxldGUgQ2xhc3MiLCJHZXQgQ2xhc3MiLCJBZGQgU2NoZWR1bGUiLCJVcGRhdGUgU2NoZWR1bGUiLCJEZWxldGUgU2NoZWR1bGUiLCJHZXQgU2NoZWR1bGUiLCJBZGQgUmVnaXN0ZXIgQm9vayIsIlVwZGF0ZSBSZWdpc3RlciBCb29rIiwiRGVsZXRlIFJlZ2lzdGVyIEJvb2siLCJHZXQgUmVnaXN0ZXIgQm9vayIsIkFkZCBBdHRlbmRhbmNlIiwiVXBkYXRlIEF0dGVuZGFuY2UiLCJEZWxldGUgQXR0ZW5kYW5jZSIsIkdldCBBdHRlbmRhbmNlIiwiR2V0IE1hcmsiLCJBZGQgTm90aWZpY2F0aW9uIiwiVXBkYXRlIE5vdGlmaWNhdGlvbiIsIkRlbGV0ZSBOb3RpZmljYXRpb24iLCJHZXQgTm90aWZpY2F0aW9uIiwiVXBkYXRlIFNldHRpbmciLCJHZXQgTG9nIl0sImV4cCI6MTcxOTExNjgxMCwiaXNzIjoiU0VQNDkwIiwiYXVkIjoiU0VQNDkwIn0.eZUoqfmhqNqS7Qamx56lpCvCuET-w2FcbAdRcFviQKg";

  const { data, error, isLoading } = useQuery(
    ["studentSchedule", { studentID, year, schoolWeek, accessToken }],
    () => getStudentTimetable(studentID, year, schoolWeek, accessToken)
  );

  const [currentTimeTable, setCurrentTimeTable] = useState([]);

  useEffect(() => {
    if (data && data.data && data.data.details) {
      setCurrentTimeTable(data.data.details);
    } else {
      setCurrentTimeTable([]);
    }
  }, [data]);

  const handleFilterTimetable = () => {};

  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [schoolClass, setSchoolClass] = React.useState(studentClasses.data[0].name);
  const handleSchoolClassSelectedChange = (event) => {
    setSchoolClass(event.target.value);
  };

  const [currentTab, setCurrentTab] = useState(0);
  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  //3.1 React-hook-from of editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue: noSetUploadValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const {
    control: controlUploadAction,
    handleSubmit: handleSubmitUploadAction,
    reset: resetUploadAction,
    setValue,
    formState: { errors: errorsUploadAction },
  } = useForm();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleViewSlotDetail = ([slotDetails, date]) => {
    if (slotDetails) {
      setCurrentSlot(slotDetails);
      setCurrentSlotDate(date);
      setOpenModalDetail(true);
    }
  };

  const handleAddWeeklyTimeTable = (data) => {
    console.log(data);
  };

  const formattedSchoolYear = schoolYears.data.map((year) => ({
    label: year.schoolYear,
    value: year.schoolYear,
  }));

  const formattedSchoolClass = studentClasses.data.map((item) => ({
    label: item.name,
    value: item.name,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          <div className="flex justify-between items-center">
            <div>
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
                  {schoolYears.data.map((item, index) => (
                    <MenuItem key={index} value={item.schoolYear}>
                      {item.schoolYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-class-lable">Lớp</InputLabel>
                <Select
                  labelId="select-school-class-lable"
                  id="select-school-class"
                  value={schoolClass}
                  className="h-10 mr-2 max-[767px]:mb-4"
                  label="Lớp"
                  onChange={handleSchoolClassSelectedChange}
                >
                  {studentClasses.data.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
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
                    <MenuItem key={index} value={item.startTime}>
                      {item.startTime} - {item.endTime}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ButtonComponent type="success" onClick={handleFilterTimetable}>
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
              <ButtonComponent
                className="max-[767px]:inline-block max-[639px]:ml-0 md:hidden"
                onClick={() => setOpenModelAdd(true)}
              >
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                TẠO
              </ButtonComponent>
            </div>

            <div className="flex items-center">
              <ButtonComponent
                className="max-[767px]:hidden md:block"
                onClick={() => setOpenModelAdd(true)}
              >
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                TẠO TKB
              </ButtonComponent>
              <PopupComponent
                title="TẠO THỜI KHÓA BIỂU"
                description={`Tạo thời khóa biểu bằng excel`}
                // rightNote={`Lớp: ${currentClass}`}
                icon={<AddCircleOutlineIcon />}
                isOpen={openModelAdd}
                onClose={() => setOpenModelAdd(false)}
                tabs={[{ label: "TẢI TEMPLATE" }, { label: "UPLOAD TEMPLATE" }]}
                currentTab={currentTab}
                onTabChange={handleTabChange}
              >
                <div role="tabpanel" hidden={currentTab !== 0}>
                  <form onSubmit={handleSubmit(handleAddWeeklyTimeTable)}>
                    <InputBaseComponent
                      name="schoolYear"
                      label="Năm học"
                      className="w-full"
                      control={control}
                      setValue={noSetValue}
                      type="select"
                      options={formattedSchoolYear}
                      errors={errors}
                      validationRules={{
                        required: "Hãy chọn năm học!",
                      }}
                    />
                    <div className="w-full flex">
                      <InputBaseComponent
                        name="schoolClass"
                        label="Lớp học"
                        className="w-1/2 mr-3"
                        control={control}
                        setValue={noSetValue}
                        type="select"
                        options={formattedSchoolClass}
                        errors={errors}
                        validationRules={{
                          required: "Hãy chọn lớp học!",
                        }}
                      />
                      <InputBaseComponent
                        name="semester"
                        label="Kì học"
                        className="w-1/2"
                        control={control}
                        setValue={noSetValue}
                        type="select"
                        options={formattedSemester}
                        errors={errors}
                        validationRules={{
                          required: "Hãy chọn kì học!",
                        }}
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                        CLEAR
                      </ButtonComponent>
                      <ButtonComponent action="submit">
                        <DownloadIcon className="mr-2" />
                        TẢI FILE
                      </ButtonComponent>
                    </div>
                  </form>
                </div>
                <div role="tabpanel" hidden={currentTab !== 0}>
                  <form
                    onSubmit={handleSubmitUploadAction((data) => console.log("Upload: ", data))}
                  >
                    <InputBaseComponent
                      name="schoolYearUpload"
                      label="Năm học"
                      className="w-full"
                      control={controlUploadAction}
                      setValue={noSetUploadValue}
                      type="select"
                      options={formattedSchoolYear}
                      errors={errorsUploadAction}
                      validationRules={{
                        required: "Hãy chọn năm học!",
                      }}
                    />
                    <div className="w-full flex">
                      <InputBaseComponent
                        name="schoolClassUpload"
                        label="Lớp học"
                        className="w-1/2 mr-3"
                        control={controlUploadAction}
                        setValue={noSetUploadValue}
                        type="select"
                        options={formattedSchoolClass}
                        errors={errorsUploadAction}
                        validationRules={{
                          required: "Hãy chọn lớp học!",
                        }}
                      />
                      <InputBaseComponent
                        name="semesterUpload"
                        label="Kì học"
                        className="w-1/2"
                        control={controlUploadAction}
                        setValue={noSetUploadValue}
                        type="select"
                        options={formattedSemester}
                        errors={errorsUploadAction}
                        validationRules={{
                          required: "Hãy chọn kì học!",
                        }}
                      />
                    </div>
                    <InputBaseComponent
                      name="timeTableFile"
                      label="Mẫu thời khóa biểu"
                      className="w-full"
                      control={controlUploadAction}
                      setValue={noSetUploadValue}
                      type="file"
                      errors={errorsUploadAction}
                      validationRules={{
                        required: "Hãy chọn file!",
                      }}
                    />
                    <div className="flex justify-end mt-4">
                      <ButtonComponent
                        type="error"
                        action="reset"
                        onClick={() => resetUploadAction()}
                      >
                        CLEAR
                      </ButtonComponent>
                      <ButtonComponent action="submit">
                        <FileUploadIcon className="mr-2" />
                        UPLOAD FILE
                      </ButtonComponent>
                    </div>
                  </form>
                </div>
              </PopupComponent>
            </div>
          </div>
          <p className="text-base font-bold mt-10">TẤT CẢ THỜI KHÓA BIỂU</p>
          <TableComponent
            header={["Năm học", "Học kì", "Lớp", "GVCN", "Từ ngày", "Đến"]}
            data={timeTableOfAllSchool}
            onEdit={(data) => console.log(data)}
            // onDetails={() => console.log(data)}
            onDelete={(data) => console.log(data)}
            className="mt-4"
            itemsPerPage={5}
          />
          <div className="text-center mt-10">
            <h4 className="text-xl font-bold uppercase">THỜI KHÓA BIỂU lớp {schoolClass}</h4>
          </div>
          <div className="flex justify-between mt-2 flex-wrap max-[767px]:mt-4">
            <div className="flex max-[767px]:mb-4">
              <div className="text-sm mr-4">
                <span className="mr-2 font-bold">Lịch học của:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  DaQL
                </span>
              </div>
              <div className="text-sm">
                <span className="mr-2 font-bold">Tổng số tiết:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {totalSlots}
                </span>
              </div>
            </div>
            <div className="text-sm">
              <span className="mr-2 font-bold">Năm học:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                {schoolYear}
              </span>
              <div>
                {/* <ButtonComponent
                  onClick={() => {
                    if (currentWeekDate.id > 0) {
                      setCurrentWeekDate(schoolWeeks[currentWeekDate.id - 1]);
                      setSchoolWeek(currentWeekDate.startTime);
                    }
                  }}
                >
                  Previous
                </ButtonComponent>
                <ButtonComponent
                  onClick={() => {
                    if (currentWeekDate.id < currentWeekDate.length - 1)
                      setCurrentWeekDate(schoolWeeks[currentWeekDate.id + 1]);
                    setSchoolWeek(currentWeekDate.startTime);
                  }}
                >
                  Next
                </ButtonComponent> */}
              </div>
            </div>
          </div>

          <TableWeeklyTimeTableComponent
            data={currentTimeTable}
            onDetails={handleViewSlotDetail}
            className="mt-4"
          />
          <div className="mt-5 text-base">
            <p className="font-bold">Ghi chú:</p>
            <ul className="list-disc ml-5">
              <li>
                <span className="success-color">(Completed): </span>
                <span className="italic">Tiết học đã kết thúc khi thời gian học kết thúc.</span>
              </li>
              <li>
                <span className="error-color">(Not-started): </span>
                <span className="italic">
                  Tiết học này chưa bắt đầu, tiết học sẽ bắt đầu khi đến ngày học.
                </span>
              </li>
              <li>
                <span className="font-bold">(-): </span>
                <span className="italic">
                  Tiết học trống, chưa có tiết học trong thời gian quy định.
                </span>
              </li>
              <li>
                <span className="success-color">(Có mặt): </span>
                <span className="italic">Học sinh/Giáo viên DaQL đã tham gia tiết học.</span>
              </li>
              <li>
                <span className="error-color">(Vắng mặt): </span>
                <span className="italic">Học sinh/Giáo viên DaQL đã không tham gia tiết học.</span>
              </li>
            </ul>
          </div>
          <PopupComponent
            title="CHI TIẾT"
            description={`TIẾT: ${currentSlot.slot}`}
            rightNote={`NGÀY: ${currentSlotDate}`}
            isOpen={openModalDetail}
            onClose={() => setOpenModalDetail(false)}
          >
            <div className="max-w-md">
              <TextValueComponent
                label="Tên môn học"
                value={currentSlot.subject}
                icon={<AutoStoriesIcon />}
                customValue="text-black font-medium"
              />
              <TextValueComponent
                label="Thời gian"
                value={currentSlot.slotTime}
                icon={<AccessAlarmIcon />}
                variantValue="success"
              />
              <TextValueComponent label="Lớp" value="12A12" icon={<MapsHomeWorkIcon />} />
              <TextValueComponent label="Phòng" value="12A12" icon={<LocationOnIcon />} />
              <TextValueComponent
                label="Giáo viên"
                value={currentSlot.teacher}
                icon={<AccountCircleIcon />}
                variantValue="warning"
              />

              <TextValueComponent
                label="Tiết giáo án"
                value={currentSlot.slotByLessonPlans}
                icon={<LockClockIcon />}
              />
              <TextValueComponent
                label="Bài học"
                value="Bài 12: Đại số tuyến tính"
                icon={<EventAvailableIcon />}
              />
              <TextValueComponent
                label="Trạng thái"
                value={currentSlot.status}
                icon={<AccessAlarmIcon />}
                customValue="error-color"
              />
              <TextValueComponent
                label="Điểm danh"
                value={currentSlot.isAttendance ? "Có mặt" : "Vắng"}
                icon={<CheckCircleIcon />}
                customValue={
                  currentSlot.isAttendance ? "success-color font-medium" : "error-color font-medium"
                }
              />

              <div className="mt-4 flex justify-end">
                <Link to="/takeAttendance" className="mr-2">
                  <ButtonComponent type="success" action="button">
                    <BorderColorIcon className="" />
                    ĐIỂM DANH
                  </ButtonComponent>
                </Link>
                <Link to="/schoolBook">
                  <ButtonComponent action="button">SỔ ĐẦU BÀI</ButtonComponent>
                </Link>
              </div>
            </div>
          </PopupComponent>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
