import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import "./style.scss";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { classrooms } from "mock/classroom";
import { schoolYears } from "mock/schoolYear";
import { studentClasses } from "mock/class";
// Class management (UolLT)
export default function ClassManagement() {
  const handleEdit = (rowItem) => {
    console.log("Edit row:", rowItem);
    // Implement edit logic here
  };
  const handleDelete = (rowItem) => {
    console.log("Delete row:", rowItem);
    // Implement delete logic here
  };
  const handleEnter = (value) => {
    console.log("Value after Enter:", value);
    // Do something with the value, such as sending it to an API or updating state
  };
  const [age, setAge] = useState("");

  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [classroom, setClassRoom] = React.useState(classrooms.data[0].name);
  const handleClassRoomSelectedChange = (event) => {
    setClassRoom(event.target.value);
  };

  const [studentclass, setStudentClass] = React.useState(studentClasses.data[0].name);
  const handleStudentClassSelectedChange = (event) => {
    setStudentClass(event.target.value);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="h-screen">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="flex justify-end items-center">
            <div className="relative border border-gray-300 rounded">
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                startIcon={<MenuIcon className="icon" />}
                sx={{ p: 0 }}
              />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                sx={{ left: -30, textAlign: "center" }}
              >
                <MenuItem onClick={handleClose}>Nhập điểm</MenuItem>
                <MenuItem onClick={handleClose}>Nhập điểm bằng excel</MenuItem>
                <MenuItem onClick={handleClose}>Sửa điểm</MenuItem>
                <MenuItem onClick={handleClose}>Sửa điểm bằng excel</MenuItem>
              </Menu>
            </div>
          </div>

          <div className="text-center mt-0">
            <h2 className="text-3xl font-bold">Quản lý lớp học</h2>
          </div>

          <div className="flex items-center justify-between">
            {/* School Year Select */}
            <div className="flex justify-start">
              <FormControl sx={{ minWidth: 80 }}>
                <InputLabel id="select-school-year-lable" className="ml-0">
                  Năm học
                </InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-10 mx-0"
                  label="Năm học"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {schoolYears.data.map((item) => (
                    <MenuItem key={item.schoolYear} value={item.schoolYear}>
                      {item.schoolYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
                <InputLabel id="select-class-room-lable" className="ml-3">
                  Phòng học
                </InputLabel>
                <Select
                  labelId="select-class-room-lable"
                  id="select-class-room"
                  value={classroom}
                  className="h-10 mx-3"
                  label="Phòng học"
                  onChange={handleClassRoomSelectedChange}
                >
                  {classrooms.data.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {/* Search, Input, Button */}
            <div className="flex justify-end">
              <div className="mr-4">
                <SearchComponent
                  data={[
                    { title: "Apple", age: 12 },
                    { title: "Banana", age: 11 },
                    { title: "ABC", age: 14 },
                  ]}
                  option="title"
                  placeHolder="Search item"
                  onEnter={handleEnter}
                  className=""
                />
              </div>
              <div className="mr-4 mt-1">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg  py-2 px-4 w-full"
                  placeholder="Nhập tên phòng học..."
                />
              </div>
              <div className="mt-1">
                <ButtonComponent type="success" size="md">
                  <AddCircleOutlineIcon className="mr-3" />
                  Tạo
                </ButtonComponent>
              </div>
            </div>
          </div>
          <div>
            <TableComponent
              header={["ID", "Tên lớp", "Phòng học"]}
              data={studentClasses.data.map((item) => [item.id, item.name, item.classroom])}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="mt-4"
            />
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
