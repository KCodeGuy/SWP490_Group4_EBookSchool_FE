import { Box, Card, Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import "./style.scss";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import { classrooms } from "mock/classroom";
// Room management (UolLT)

export default function RoomManagement() {
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

  const [classroom, setClassRoom] = React.useState(classrooms.data[0].name);
  const handleClassRoomSelectedChange = (event) => {
    setClassRoom(event.target.value);
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
      <Card>
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

          <div className="text-center">
            <h2 className="text-3xl font-bold">Quản lý phòng học</h2>
          </div>

          <div className="flex justify-end items-center">
            {/* Search component */}
            <div className="mr-auto">
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

            <div className="mr-4">
              <input
                type="text"
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
                placeholder="Nhập tên phòng học..."
              />
            </div>

            <div>
              <ButtonComponent type="success" size="md">
                <AddCircleOutlineIcon className="mr-3" />
                Tạo
              </ButtonComponent>
            </div>
          </div>

          <div>
            <TableComponent
              header={["ID", "Tên phòng học", "Mô tả"]}
              data={classrooms.data.map((item) => [item.id, item.name, item.description])}
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
