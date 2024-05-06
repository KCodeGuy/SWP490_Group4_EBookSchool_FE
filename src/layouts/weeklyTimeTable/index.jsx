import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";

import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { studentWeeklyTimeTableDates } from "../../mock/weeklyTimeTable";
import TableWeeklyTimeTableComponent from "../../components/TableWeeklyTimeTable";
import PopupComponent from "components/PopupComponent/PopupComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { studentClasses } from "../../mock/class";
import { schoolYears } from "../../mock/schoolYear";
import { subjects } from "../../mock/subject.js";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchInputComponent from "components/SearchInputComponent/SearchInputComponent";

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

export default function WeeklyTimeTable() {
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(1);
  const [currentRoom, setCurrentClass] = useState("12A1");

  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [schoolClass, setSchoolClass] = React.useState(studentClasses.data[0].name);
  const handleSchoolClassSelectedChange = (event) => {
    setSchoolClass(event.target.value);
  };

  const [schoolWeek, setSchoolWeek] = React.useState(schoolWeeks[0].name);
  const handleSchoolWeeksSelectedChange = (event) => {
    setSchoolWeek(event.target.value);
  };

  //3.1 React-hook-from of editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const handleViewSlotDetail = ([slotDetails, date]) => {
    if (slotDetails) {
      setCurrentSlot(slotDetails.slot);
      setValue("id", slotDetails.id);
      setValue("date", date);
      setValue("classRoom", slotDetails.classRoom);
      setValue("slotTime", slotDetails.slotTime);
      setValue("subject", slotDetails.subject);
      setValue("slotByLessonPlans", slotDetails.slotByLessonPlans);
      setValue("status", slotDetails.status);
      setValue("isAttendance", slotDetails.isAttendance);
      setValue("teacher", slotDetails.teacher);
      setOpenModalDetail(true);
    }

    console.log("slot details: ", slotDetails);
    console.log("date: ", date);
  };

  const handleChangeSearchValue = (txtSearch) => {
    console.log(txtSearch);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          <div className="flex justify-between items-center">
            <div>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable" className="ml-3">
                  Năm học
                </InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-10"
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
                <InputLabel id="select-school-class-lable" className="ml-3">
                  Lớp
                </InputLabel>
                <Select
                  labelId="select-school-class-lable"
                  id="select-school-class"
                  value={schoolClass}
                  className="h-10 mx-2"
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
                <InputLabel id="select-school-week-lable" className="ml-3">
                  Tuần
                </InputLabel>
                <Select
                  labelId="select-school-week-lable"
                  id="select-school-class"
                  value={schoolWeek}
                  className="h-10 mr-2"
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
              <ButtonComponent type="success">
                <FilterAltIcon className="mr-1" /> Filter
              </ButtonComponent>
            </div>
            <div className="flex items-center">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
                className="mr-3"
              />
            </div>
          </div>
          <div className="text-center mt-7">
            <h4 className="text-xl font-bold uppercase">THỜI KHÓA BIỂU lớp {schoolClass}</h4>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-sm">
              <span className="mr-2 font-bold">Lịch học của:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                DaQL
              </span>
            </div>
            <div className="text-sm">
              <span className="mr-2 font-bold">Năm học:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                {schoolYear}
              </span>
            </div>
          </div>
          <TableWeeklyTimeTableComponent
            data={studentWeeklyTimeTableDates.data.details}
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
                  Tiết học này chưa bắt đầu, tiết học sẽ bắt đầu khi đến ngày học
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
            description={`TIẾT: ${currentSlot}`}
            rightNote={`Lớp: ${currentRoom}`}
            isOpen={openModalDetail}
            onClose={() => setOpenModalDetail(false)}
          >
            <form onSubmit={handleSubmitEditAction((data) => console.log("Edit: ", data))}>
              <div className="flex">
                <InputBaseComponent
                  name="date"
                  placeholder="Chọn ngày"
                  label="Ngày"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="date"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Hãy chọn ngày!",
                  }}
                />
                <InputBaseComponent
                  name="classRoom"
                  label="Phòng học"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[]}
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Hãy xếp loại tiết!",
                  // }}
                />
                <InputBaseComponent
                  name="slotTime"
                  label="Thời gian"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="text"
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Hãy xếp loại tiết!",
                  // }}
                />
              </div>
              <div className="flex">
                <InputBaseComponent
                  name="subject"
                  label="Môn học"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[]}
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Hãy xếp loại tiết!",
                  // }}
                />
                <InputBaseComponent
                  name="slotByLessonPlans"
                  label="Tiết học"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[]}
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Hãy xếp loại tiết!",
                  // }}
                />
                <InputBaseComponent
                  name="status"
                  label="Trạng thái"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[]}
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Hãy xếp loại tiết!",
                  // }}
                />
              </div>
              <div className="flex">
                <InputBaseComponent
                  name="isAttendance"
                  label="Có mặt"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[]}
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Hãy xếp loại tiết!",
                  // }}
                />
                <InputBaseComponent
                  name="teacher"
                  label="Giáo viên"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="text"
                  options={[]}
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Hãy xếp loại tiết!",
                  // }}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <ButtonComponent type="success" action="button">
                  <BorderColorIcon className="mr-1" />
                  ĐIỂM DANH
                </ButtonComponent>
                <div>
                  <ButtonComponent type="error" action="reset" onClick={() => resetEditAction()}>
                    CLEAR
                  </ButtonComponent>
                  <ButtonComponent action="submit">CẬP NHẬT</ButtonComponent>
                </div>
              </div>
            </form>
          </PopupComponent>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
