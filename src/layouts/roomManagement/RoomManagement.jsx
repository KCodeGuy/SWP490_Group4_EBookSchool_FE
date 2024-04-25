import { Box, Card, Button, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import "./style.scss";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="text-center">
            <h4 className="text-xl font-bold">Quản lý phòng học</h4>
          </div>

          <div className="flex justify-end items-center">
            {/* Search component */}
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
              data={classrooms.data.map((item) => [
                item.id.toString(),
                item.name.toString(),
                item.description.toString(),
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
