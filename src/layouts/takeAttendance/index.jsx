import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import TableComponent from "../../components/TableComponent/TableComponent";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import { students } from "../../mock/student";

export default function TakeAttendance() {
  console.log(students);

  const [tableData, setTableData] = useState([
    ["Nguyen van", "Doe", "25"],
    ["Le van", "Smith", "30"],
    ["Tran thi", "Smith", "30"],
    ["Quach tuan minh", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Dinh minh", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Tuan", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Admin role", "Smith", "30"],
    ["Admin", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Son tung", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Den vau", "Smith", "30"],
    ["Phan manh", "Smith", "30"],
    ["Dang tuan", "Smith", "30"],
  ]);

  const handleChecked = (rowItem) => {
    console.log("checked:", rowItem);
    // Implement delete logic here
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          <div className="text-center mt-7">
            <h4 className="text-xl font-bold uppercase">ĐIỂM DANH LỚP 12A1</h4>
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
                2019-2020
              </span>
            </div>
          </div>
          <TableComponent
            header={["Hình ảnh", "Mã học sinh", "Tên học sinh", "Ngày sinh", "Giới tính"]}
            data={students.data.map((item) => [
              item.fullName.toString(),
              item.id.toString(),
              item.birthday.toString(),
              item.gender.toString(),
            ])}
            onCheckboxChange={handleChecked}
            showCheckboxes={true}
            className="mt-4"
            isShowImage={true}
          />
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
