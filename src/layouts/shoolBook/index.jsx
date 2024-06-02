import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent.jsx";
import Footer from "../../examples/Footer/index.js";
import { studentClasses } from "../../mock/class.js";
import { schoolYears } from "../../mock/schoolYear.js";
import { subjects } from "../../mock/subject.js";
import { registerBooks } from "../../mock/registerBook.js";

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
const formattedSubjects = subjects.data.map((subject) => ({
  label: subject.name,
  value: subject.name,
}));

import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { formatDateYearsMonthsDates } from "utils/CommonFunctions";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent.jsx";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent.jsx";
import TableRegisterBookComponent from "../../components/TableRegisterBookComponent/index.jsx";
import PopupComponent from "../../components/PopupComponent/PopupComponent.jsx";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent.jsx";

const SchoolBook = () => {
  const [openModalAddSchoolBook, setOpenModalAddSchoolBook] = useState(false);
  const [openModalEditSchoolBook, setOpenModalEditSchoolBook] = useState(false);
  const teacherOfSlot = "Quach Luynl Da";
  const currentClass = "12A1";

  //3.1 React-hook-from of adding action
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
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const handleAddSchoolBook = (data) => {
    console.log("Call API schoolBook: ", data);
    // Call API add class here
  };

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

  const handleViewSlotDetail = (slot) => {
    if (slot) {
      setValue("id", slot.id);
      setValue("dateEdit", formatDateYearsMonthsDates(slot.date));
      setValue("weekDateEdit", slot.weekDate);
      setValue("slotEdit", slot.slot);
      setValue("subjectEdit", slot.subject);
      setValue("teacherEdit", slot.teacher);
      setValue("slotByLessonPlansEdit", slot.slotByLessonPlans);
      setValue("numberOfAbsentEdit", slot.numberOfAbsent);
      setValue("titleEdit", slot.title);
      setValue("noteEdit", slot.note);
      setValue("ratingEdit", slot.rating);
      setOpenModalEditSchoolBook(true);
    } else {
      setOpenModalEditSchoolBook(false);
    }
  };

  const transformedData = [];
  registerBooks.data.detail.forEach((detail) => {
    const date = detail.date;
    const weekDate = detail.weekDate;

    detail.slots.forEach((slot) => {
      const transformedSlot = {
        id: detail.id,
        date: date,
        weekDate: weekDate,
        slot: slot.slot,
        subject: slot.subject,
        teacher: slot.teacher,
        slotByLessonPlans: slot.slotByLessonPlans,
        numberOfAbsent: slot.numberOfAbsent,
        memberAbsent: slot.memberAbsent,
        title: slot.title,
        note: slot.note,
        rating: slot.rating,
      };
      transformedSlot.countSlots = detail.slots.length;
      transformedData.push(transformedSlot);
    });
  });

  const handleChangeSearchValue = (txtSearch) => {
    console.log(txtSearch);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalItems = schoolWeeks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = schoolWeeks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
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
                  className="h-10 mx-3"
                  label="Năm học"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {schoolYears.data.map((item, index) => (
                    <MenuItem className="mt-1" key={index} value={item.schoolYear}>
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
                  className="h-10 mx-3"
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
                  className="h-10 mx-3"
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
              <ButtonComponent onClick={() => setOpenModalAddSchoolBook(true)}>
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                NHẬP SỔ ĐẦU BÀI
              </ButtonComponent>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <PopupComponent
              title="NHẬP SỔ ĐẦU BÀI"
              description={`GVBM: ${teacherOfSlot}`}
              rightNote={`Lớp: ${currentClass}`}
              icon={<AddCircleOutlineIcon />}
              isOpen={openModalAddSchoolBook}
              onClose={() => setOpenModalAddSchoolBook(false)}
            >
              <form onSubmit={handleSubmit(handleAddSchoolBook)}>
                <div className="flex">
                  <InputBaseComponent
                    name="date"
                    placeholder="Chọn ngày"
                    label="Ngày"
                    className="w-1/3 mr-3"
                    control={control}
                    setValue={noSetValue}
                    type="date"
                    errors={errors}
                    validationRules={{
                      required: "Hãy chọn ngày!",
                    }}
                  />
                  <InputBaseComponent
                    name="slot"
                    label="Tiết học"
                    className="w-1/2 mr-3"
                    control={control}
                    setValue={noSetValue}
                    type="select"
                    options={[
                      { id: 1, label: "Tiết 1", value: "1" },
                      { id: 2, label: "Tiết 2", value: "2" },
                      { id: 3, label: "Tiết 3", value: "3" },
                      { id: 4, label: "Tiết 4", value: "4" },
                      { id: 5, label: "Tiết 5", value: "5" },
                      { id: 6, label: "Tiết 6", value: "6" },
                      { id: 7, label: "Tiết 7", value: "7" },
                      { id: 8, label: "Tiết 8", value: "8" },
                      { id: 9, label: "Tiết 9", value: "9" },
                      { id: 10, label: "Tiết 10", value: "10" },
                    ]}
                    errors={errors}
                    validationRules={{
                      required: "Hãy chọn tiết học!",
                    }}
                  />
                  <InputBaseComponent
                    name="numberOfAbsent"
                    placeholder="Nhập số lượng vắng"
                    type="number"
                    className="w-1/2"
                    control={control}
                    setValue={noSetValue}
                    label="HS vắng"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                      pattern: {
                        value: /^[1-9]*$/,
                        message: "Sai định dạng số!",
                      },
                    }}
                  />
                </div>
                <div className="flex">
                  <InputBaseComponent
                    name="rating"
                    label="Xếp loại tiết"
                    className="w-1/3 mr-3"
                    control={control}
                    setValue={noSetValue}
                    type="select"
                    options={[
                      { id: 1, label: "Loại A (Tốt)", value: "A" },
                      { id: 2, label: "Loại B (Khá)", value: "B" },
                      { id: 3, label: "Loại C (Trung bình)", value: "C" },
                      { id: 4, label: "Loại D (Kém)", value: "D" },
                    ]}
                    errors={errors}
                    validationRules={{
                      required: "Hãy xếp loại tiết!",
                    }}
                  />
                  <InputBaseComponent
                    name="subject"
                    label="Môn học"
                    className="w-1/2 mr-3"
                    control={control}
                    setValue={noSetValue}
                    type="select"
                    options={formattedSubjects}
                    errors={errors}
                    validationRules={{
                      required: "Hãy chọn môn học!",
                    }}
                  />
                  <InputBaseComponent
                    name="slotByLessonPlans"
                    label="Tiết theo môn"
                    className="w-1/2"
                    control={control}
                    setValue={noSetValue}
                    type="select"
                    options={[
                      { id: 1, label: "Tiết 1", value: "slot 1" },
                      { id: 2, label: "Tiết 2", value: "slot 2" },
                      { id: 3, label: "Tiết 3", value: "slot 3" },
                      { id: 4, label: "Tiết 4", value: "slot 4" },
                      { id: 5, label: "Tiết 5", value: "slot 5" },
                      { id: 6, label: "Tiết 6", value: "slot 6" },
                      { id: 7, label: "Tiết 7", value: "slot 7" },
                      { id: 8, label: "Tiết 8", value: "slot 8" },
                      { id: 9, label: "Tiết 9", value: "slot 9" },
                      { id: 10, label: "Tiết 10", value: "slot 10" },
                      { id: 11, label: "Tiết 11", value: "slot 11" },
                      { id: 12, label: "Tiết 12", value: "slot 12" },
                      { id: 13, label: "Tiết 13", value: "slot 13" },
                      { id: 14, label: "Tiết 14", value: "slot 14" },
                      { id: 15, label: "Tiết 15", value: "slot 15" },
                    ]}
                    errors={errors}
                    validationRules={{
                      required: "Hãy chọn tiết học!",
                    }}
                  />
                </div>
                <InputBaseComponent
                  name="title"
                  placeholder="Nhập nội dung tiết học"
                  type="textArea"
                  control={control}
                  rowTextArea={2}
                  setValue={noSetValue}
                  label="Nội dung"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />

                <InputBaseComponent
                  name="note"
                  placeholder="Nhập nội nhận xét"
                  type="text"
                  control={control}
                  setValue={noSetValue}
                  label="Nhập xét"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <div className="mt-4 flex justify-between">
                  <ButtonComponent type="success" action="button">
                    <BorderColorIcon className="mr-1" />
                    ĐIỂM DANH
                  </ButtonComponent>
                  <div>
                    <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                      CLEAR
                    </ButtonComponent>
                    <ButtonComponent action="submit">HOÀN TẤT</ButtonComponent>
                  </div>
                </div>
              </form>
            </PopupComponent>
          </div>
          <div className="text-center mt-7">
            <h4 className="text-xl font-bold uppercase">Sổ shi đầu bài lớp {schoolClass} HK1</h4>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-sm">
              <span className="mr-2 font-bold">GVCN:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                {teacherOfSlot}
              </span>
            </div>
            <div className="text-sm">
              <span className="mr-2 font-bold">Năm học:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                {schoolYear}
              </span>
            </div>
          </div>
          <TableRegisterBookComponent
            header={[
              "Ngày",
              "Tiết",
              "Môn học",
              "GV bộ môn",
              "Tiết theo môn",
              "Vắng",
              "Nội dung",
              "Nhận xét",
              "Xếp loại",
            ]}
            itemsPerPage={70}
            isPaginated={true}
            data={transformedData}
            onDetails={handleViewSlotDetail}
            className="mt-8"
          />
          <div className="mt-5 text-base">
            <p className="font-bold">Ghi chú:</p>
            <ul className="list-disc ml-5">
              <li>
                <span className="success-color">(A): </span>
                <span className="italic">Tiết tích cực, tốt.</span>
              </li>
              <li>
                <span className="primary-color">(B): </span>
                <span className="italic">Tiết học khá.</span>
              </li>
              <li>
                <span className="warning-color">(C): </span>
                <span className="italic">Tiết Trung bình.</span>
              </li>
              <li>
                <span className="error-color">(D): </span>
                <span className="italic">Tiết học kém.</span>
              </li>
            </ul>
          </div>
          <PopupComponent
            title="CẬP NHẬT SỔ"
            description={`GVBM: ${teacherOfSlot}`}
            rightNote={`Lớp: ${currentClass}`}
            icon={<AddCircleOutlineIcon />}
            isOpen={openModalEditSchoolBook}
            onClose={() => setOpenModalEditSchoolBook(false)}
          >
            <form onSubmit={handleSubmitEditAction((data) => console.log("Edit: ", data))}>
              <div className="flex">
                <InputBaseComponent
                  name="dateEdit"
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
                  name="slotEdit"
                  label="Tiết học"
                  className="w-1/2 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[
                    { id: 1, label: "Tiết 1", value: "1" },
                    { id: 2, label: "Tiết 2", value: "2" },
                    { id: 3, label: "Tiết 3", value: "3" },
                    { id: 4, label: "Tiết 4", value: "4" },
                    { id: 5, label: "Tiết 5", value: "5" },
                  ]}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Hãy chọn tiết học!",
                  }}
                />
                <InputBaseComponent
                  name="numberOfAbsentEdit"
                  placeholder="Nhập số lượng vắng"
                  type="number"
                  className="w-1/2"
                  control={controlEditAction}
                  setValue={setValue}
                  label="HS vắng"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                    pattern: {
                      value: /^[1-9]*$/,
                      message: "Sai định dạng số!",
                    },
                  }}
                />
              </div>
              <div className="flex">
                <InputBaseComponent
                  name="ratingEdit"
                  label="Xếp loại tiết"
                  className="w-1/3 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[
                    { id: 1, label: "Loại A (Tốt)", value: "A" },
                    { id: 2, label: "Loại B (Khá)", value: "B" },
                    { id: 3, label: "Loại C (Trung bình)", value: "C" },
                    { id: 4, label: "Loại D (Kém)", value: "D" },
                  ]}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Hãy xếp loại tiết!",
                  }}
                />
                <InputBaseComponent
                  name="subjectEdit"
                  label="Môn học"
                  className="w-1/2 mr-3"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={formattedSubjects}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Hãy chọn môn học!",
                  }}
                />
                <InputBaseComponent
                  name="slotByLessonPlansEdit"
                  label="Tiết theo môn"
                  className="w-1/2"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={[
                    { id: 1, label: "Tiết 1", value: "1" },
                    { id: 2, label: "Tiết 2", value: "2" },
                    { id: 3, label: "Tiết 3", value: "3" },
                    { id: 4, label: "Tiết 4", value: "4" },
                    { id: 5, label: "Tiết 5", value: "5" },
                    { id: 6, label: "Tiết 6", value: "6" },
                    { id: 7, label: "Tiết 7", value: "7" },
                    { id: 8, label: "Tiết 8", value: "8" },
                    { id: 9, label: "Tiết 9", value: "9" },
                    { id: 10, label: "Tiết 10", value: "10" },
                  ]}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Hãy chọn tiết học!",
                  }}
                />
              </div>
              <InputBaseComponent
                name="titleEdit"
                placeholder="Nhập nội dung tiết học"
                type="textArea"
                control={controlEditAction}
                rowTextArea={2}
                setValue={setValue}
                label="Nội dung"
                errors={errorsEditAction}
                validationRules={{
                  required: "Không được bỏ trống!",
                }}
              />
              <InputBaseComponent
                name="noteEdit"
                placeholder="Nhập nội nhận xét"
                type="text"
                control={controlEditAction}
                setValue={setValue}
                label="Nhập xét"
                errors={errorsEditAction}
                validationRules={{
                  required: "Không được bỏ trống!",
                }}
              />
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
};
export default SchoolBook;
