import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

import noDataImage from "../../assets/images/noDataImage.png";
import noDataImage2 from "../../assets/images/noDataImage2.png";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import TableWeeklyTimeTableComponent from "../../components/TableWeeklyTimeTable";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import TextValueComponent from "../../components/TextValueComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import { schoolYears } from "../../mock/schoolYear";
import { timeTablesAllSchool } from "../../mock/weeklyTimeTable";
import { getStudentTimetable } from "services/TimeTableService";
import { useQuery } from "react-query";
import { generateSchoolWeeks } from "utils/CommonFunctions";
import { getTodayDate } from "utils/CommonFunctions";
import { getWeekForDate } from "utils/CommonFunctions";
import { isTodayInSchoolYear } from "../../utils/CommonFunctions";
import { getSSubjectTeacherTimetable } from "services/TimeTableService";
import { getSTimetable } from "services/TimeTableService";
import { getTimetable } from "../../services/TimeTableService";
import { getUserRole } from "utils/handleUser";

export default function WeeklyTimeTable() {
  const [openModelAdd, setOpenModelAdd] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({});
  const [currentSlotDate, setCurrentSlotDate] = useState("");
  const [currentTimeTable, setCurrentTimeTable] = useState([]);
  // console.log("Re-render");

  let accessToken, currentUser, userRole, userID, currentClasses;
  accessToken = localStorage.getItem("authToken");
  currentClasses = JSON.parse(localStorage.getItem("currentClasses"));
  currentUser = JSON.parse(localStorage.getItem("user"));
  userRole = localStorage.getItem("userRole");
  userID = currentUser.id;

  const [currentTab, setCurrentTab] = useState(0);
  const { formattedDate, today } = getTodayDate();

  // // Example usage
  const [schoolYear, setSchoolYear] = React.useState(
    schoolYears.data[schoolYears.data.length - 1].schoolYear
  );
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  // // Example usage
  const [schoolClass, setSchoolClass] = React.useState(currentClasses[0]?.classroom);
  const handleChangeClass = (event) => {
    setSchoolClass(event.target.value);
  };

  const schoolWeeks = generateSchoolWeeks(schoolYear);

  let currentWeek;
  if (isTodayInSchoolYear(schoolYear)) {
    currentWeek = getWeekForDate(schoolWeeks, today);
  }

  const [currentWeekDate, setCurrentWeekDate] = useState(currentWeek);
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

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["timetable", { userID, schoolYear, schoolWeek, accessToken, userRole, schoolClass }],
    queryFn: () => getTimetable(userID, schoolYear, schoolWeek, accessToken, userRole, schoolClass),
    enabled: false, // Disable automatic fetching
  });

  const handleFilterTimetable = () => {
    refetch().then((result) => {
      if (result.data?.success) {
        setCurrentTimeTable(result.data?.data?.details);
      }
    });
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
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

  const handleDelete = (item) => {
    if (item) {
      setModalDeleteOpen(true);
    }
  };

  const handleAddWeeklyTimeTable = (data) => {
    console.log(data);
  };

  const handleEdit = (item) => {
    if (item) {
      setOpenModalUpdate(true);
    }
  };

  const handleDownloadTemplate = () => {};

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
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
              {userRole === "HomeroomTeacher" ||
              userRole === "Principal" ||
              userRole === "Headteacher" ? (
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
                    {currentClasses?.map((item, index) => (
                      <MenuItem key={index} value={item.classroom}>
                        {item.classroom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                ""
              )}

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-week-lable">Tuần</InputLabel>
                <Select
                  labelId="select-school-week-lable"
                  id="select-school-week"
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
              {userRole === "Principal" || userRole === "Headteacher" ? (
                <ButtonComponent
                  className="max-[767px]:hidden md:block"
                  onClick={() => setOpenModelAdd(true)}
                >
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  TẠO
                </ButtonComponent>
              ) : (
                ""
              )}
              <PopupComponent
                title="TẠO KHÓA BIỂU"
                description={`Tạo khóa biểu bằng excel`}
                // rightNote={`Lớp: ${currentClass}`}
                icon={<AddCircleOutlineIcon />}
                isOpen={openModelAdd}
                onClose={() => setOpenModelAdd(false)}
                tabs={[{ label: "TẠO SLOT" }, { label: "TẠO BẰNG EXCEL" }]}
                currentTab={currentTab}
                onTabChange={handleTabChange}
              >
                <div role="tabpanel" hidden={currentTab !== 0}>
                  <form onSubmit={handleSubmit(handleAddWeeklyTimeTable)}>
                    <div className="flex">
                      <InputBaseComponent
                        name="classID"
                        label="Lớp học"
                        placeholder="Nhập tên lớp học..."
                        className="w-1/2 mr-2"
                        control={control}
                        setValue={noSetValue}
                        type="text"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        name="subjectID"
                        label="Môn học"
                        placeholder="Nhập tên môn học..."
                        className="w-1/2"
                        control={control}
                        setValue={noSetValue}
                        type="text"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div>
                    <div className="w-full flex">
                      <InputBaseComponent
                        name="teacherID"
                        label="Giáo viên"
                        placeholder="Nhập mã giáo viên..."
                        className="w-1/2 mr-2"
                        control={control}
                        setValue={noSetValue}
                        type="text"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        name="slotLesssonPlane"
                        label="Tiết theo giáo án"
                        placeholder="Nhập tiết theo giáo án"
                        className="w-1/2"
                        control={control}
                        setValue={noSetValue}
                        type="number"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div>

                    <InputBaseComponent
                      name="slotDate"
                      label="Chọn ngày"
                      placeholder="Chọn ngày..."
                      className="w-full"
                      control={control}
                      setValue={noSetValue}
                      type="date"
                      errors={errors}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />

                    <div className="flex justify-end mt-4">
                      <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                        CLEAR
                      </ButtonComponent>
                      <ButtonComponent action="submit">TẠO</ButtonComponent>
                    </div>
                  </form>
                </div>
                <div role="tabpanel" hidden={currentTab == 1}>
                  <ButtonComponent action="submit" onClick={handleDownloadTemplate}>
                    <DownloadIcon className="mr-2" />
                    TẢI FILE
                  </ButtonComponent>
                  <form onSubmit={handleSubmit(handleAddWeeklyTimeTable)}>
                    <InputBaseComponent
                      name="timeTableFile"
                      label="Thời Khóa biểu(Excel)"
                      className="w-full mt-5"
                      control={control}
                      setValue={noSetValue}
                      type="file"
                      errors={errors}
                      validationRules={{
                        required: "Hãy chọn file!",
                      }}
                    />
                    <div className="mt-5 flex justify-end">
                      <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                        CLEAR
                      </ButtonComponent>
                      <ButtonComponent action="submit">TẠO</ButtonComponent>
                    </div>
                  </form>
                </div>
              </PopupComponent>
            </div>
          </div>
          {userRole === "Principal" || userRole === "Headteacher" ? (
            <>
              <p className="text-base font-bold mt-10">TẤT CẢ THỜI KHÓA BIỂU</p>
              <TableComponent
                header={["Năm học", "Học kì", "Lớp", "GVCN", "Từ ngày", "Đến"]}
                data={timeTableOfAllSchool}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="mt-4"
                itemsPerPage={5}
              />
            </>
          ) : (
            ""
          )}

          <div className="text-center mt-10">
            <h4 className="text-xl font-bold uppercase">
              {userRole === "HomeroomTeacher" ||
              userRole === "Principal" ||
              userRole === "Headteacher"
                ? `THỜI KHÓA BIỂU LỚP ${schoolClass}`
                : `THỜI KHÓA BIỂU(${currentUser.fullname.toString()})`}
            </h4>
          </div>
          <div className="flex justify-between mt-2 flex-wrap max-[767px]:mt-4">
            <div className="flex max-[767px]:mb-4">
              <div className="text-sm mr-4">
                <span className="mr-2 font-bold">
                  {userRole == "Student" ? "Học sinh: " : "Giáo viên: "}
                </span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentUser ? currentUser.fullname.toString() : ""}
                </span>
              </div>
              <div className="text-sm">
                <span className="mr-2 font-bold">Tổng số tiết:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  16
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
          {isLoading ? (
            <div className="text-center primary-color my-10 text-xl italic font-medium">
              <div className="mx-auto flex items-center justify-center">
                <p className="mr-3">Loading</p>
                <CircularProgress size={24} color="inherit" />
              </div>
            </div>
          ) : data?.success && currentTimeTable.length > 0 ? (
            <TableWeeklyTimeTableComponent
              data={currentTimeTable}
              onDetails={handleViewSlotDetail}
              onDelete={handleDelete}
              userRole={userRole}
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

          <PopupComponent
            title="CẬP NHẬT KHÓA BIỂU"
            description={`Cập nhật biểu bằng excel`}
            icon={<AddCircleOutlineIcon />}
            isOpen={openModalUpdate}
            onClose={() => setOpenModalUpdate(false)}
          >
            <form onSubmit={handleSubmit(handleAddWeeklyTimeTable)}>
              <InputBaseComponent
                name="timeTableFile"
                label="Thời Khóa biểu(Excel)"
                className="w-full mt-2"
                control={control}
                setValue={noSetValue}
                type="file"
                errors={errors}
                validationRules={{
                  required: "Hãy chọn file!",
                }}
              />
              <div className="mt-5 flex justify-end">
                <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                  CLEAR
                </ButtonComponent>
                <ButtonComponent action="submit">CẬP NHẬT</ButtonComponent>
              </div>
            </form>
          </PopupComponent>
          <PopupComponent
            title="XÓA THỜI KHÓA BIỂU"
            description="Hãy kiểm xác nhận thông tin trước khi xóa"
            icon={<DeleteIcon />}
            isOpen={modalDeleteOpen}
            onClose={() => setModalDeleteOpen(false)}
          >
            <p>Bạn có chắc chắn muốn xóa thời khóa biểu?</p>
            <div className="mt-4 flex justify-end">
              <ButtonComponent
                type="error"
                action="button"
                onClick={() => setModalDeleteOpen(false)}
              >
                HỦY BỎ
              </ButtonComponent>
              <ButtonComponent action="button" onClick={handleDelete}>
                XÓA
              </ButtonComponent>
            </div>
          </PopupComponent>
          <div className="mt-5 text-base">
            <p className="font-bold">Ghi chú:</p>
            <ul className="list-disc ml-5">
              <li>
                <span className="error-color">(Chưa bắt đầu): </span>
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
          {data?.success && currentTimeTable.length > 0 ? (
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
                <TextValueComponent
                  label="Lớp"
                  value={currentSlot.classroom}
                  icon={<LocationOnIcon />}
                />
                <TextValueComponent
                  label="Phòng"
                  value={currentSlot.classroom}
                  icon={<LocationOnIcon />}
                />
                <TextValueComponent
                  label="Giáo viên"
                  value={currentSlot.teacher}
                  icon={<AccountCircleIcon />}
                  variantValue="warning"
                />
                <TextValueComponent label="Bài học" value={"skf"} icon={<EventAvailableIcon />} />
                <TextValueComponent
                  label="Tiết giáo án"
                  value={currentSlot.slotByLessonPlans}
                  icon={<LockClockIcon />}
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
                    currentSlot.isAttendance
                      ? "success-color font-medium"
                      : "error-color font-medium"
                  }
                />

                <div className="mt-4 flex justify-end">
                  {userRole === "SubjectTeacher" || userRole === "Principal" ? (
                    <Link to="/takeAttendance" className="mr-2">
                      <ButtonComponent type="success" action="button">
                        <BorderColorIcon className="" />
                        ĐIỂM DANH
                      </ButtonComponent>
                    </Link>
                  ) : (
                    ""
                  )}
                  {userRole !== "Student" ? (
                    <Link to="/schoolBook">
                      <ButtonComponent action="button">SỔ ĐẦU BÀI</ButtonComponent>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </PopupComponent>
          ) : (
            ""
          )}
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
