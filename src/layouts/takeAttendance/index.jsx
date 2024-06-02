import React, { useState } from "react";
import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CheckIcon from "@mui/icons-material/Check";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import TableComponent from "../../components/TableComponent/TableComponent";
import { students } from "../../mock/student";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { studentClasses } from "../../mock/class";
import { schoolYears } from "../../mock/schoolYear";
import { studentWeeklyTimeTableDates, timeTablesAllSchool } from "../../mock/weeklyTimeTable";
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

const formattedSemester = [
  { label: "Học kì 1", value: "HK1" },
  { label: "Học kì 2", value: "HK2" },
  { label: "Cả năm", value: "Cả năm" },
];

export default function TakeAttendance() {
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const [currentData, setCurrentData] = useState(students.data);

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

  const handleChecked = (rowItem) => {
    // console.log("checked:", rowItem);
    // Implement delete logic here
  };

  const formattedSchoolYear = schoolYears.data.map((year) => ({
    label: year.schoolYear,
    value: year.schoolYear,
  }));

  const formattedSchoolClass = studentClasses.data.map((item) => ({
    label: item.name,
    value: item.name,
  }));

  const handleSaveData = (rowItem) => {
    console.log("List saved", rowItem);
    // Implement delete logic here
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterStudentClasses(txtSearch, students.data));
  };

  const filterStudentClasses = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((student) => {
      return (
        student.fullName.toLowerCase().includes(search) ||
        student.id.toString().toLowerCase().includes(search) ||
        student.birthday.toLowerCase().includes(search)
      );
    });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <div className="flex justify-between items-center flex-wrap">
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
                    <MenuItem key={index} value={item.name}>
                      {item.startTime} - {item.endTime}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ButtonComponent type="success">
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
            </div>
            <SearchInputComponent
              onSearch={handleChangeSearchValue}
              placeHolder="Nhập từ khóa..."
              className="mr-3"
            />
          </div>
          <div className="text-center mt-10">
            <h4 className="text-xl font-bold uppercase">ĐIỂM DANH LỚP 12A1</h4>
          </div>
          <div className="flex justify-between mt-2 flex-wrap max-[767px]:mt-4">
            <div className="flex max-[767px]:mb-4">
              <div className="text-sm mr-4">
                <span className="mr-2 font-bold">GVCN:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  DaQL
                </span>
              </div>
              <div className="text-sm mr-4">
                <span className="mr-2 font-bold">Tiết:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  1
                </span>
              </div>
              <div className="text-sm">
                <span className="mr-2 font-bold">Ngày:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  15/04/05
                </span>
              </div>
            </div>
            <div className="text-sm">
              <ButtonComponent onClick={() => setIsCheckedAll(!isCheckedAll)}>
                <CheckIcon className="mr-2" />
                CHỌN TẤT CẢ
              </ButtonComponent>
            </div>
          </div>

          <TableComponent
            header={[
              "Hình ảnh",
              "Tên học sinh",
              "Mã học sinh",
              "Giới tính",
              "Ngày sinh",
              "Trạng thái",
            ]}
            data={currentData.map((item) => [
              item.fullName.toString(),
              item.id.toString(),
              item.gender.toString(),
              item.birthday.toString(),
              "Chưa điểm danh",
            ])}
            onCheckboxChange={handleChecked}
            showCheckboxes={true}
            className="mt-4"
            onSave={handleSaveData}
            isShowImage={true}
            isCheckedAll={isCheckedAll}
            saveName="ĐIỂM DANH"
          />
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
