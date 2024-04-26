import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import "./style.scss";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
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
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };
  const [classroom, setClassRoom] = React.useState(classrooms.data[0].name);
  const handleClassRoomSelectedChange = (event) => {
    setClassRoom(event.target.value);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="h-screen">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">Quản lý lớp học</h4>
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
                    <MenuItem key={item.schoolYear.toString()} value={item.schoolYear.toString()}>
                      {item.schoolYear.toString()}
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
                    <MenuItem key={item.name.toString()} value={item.name.toString()}>
                      {item.name.toString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {/* Search, Input, Button */}
            <div className="flex justify-end">
              <div className="mr-6 mt-1">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full"
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
              data={studentClasses.data.map((item) => [
                item.id.toString(),
                item.name.toString(),
                item.classroom.toString(),
              ])}
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
