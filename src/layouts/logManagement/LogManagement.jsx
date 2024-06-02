import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import LockClockIcon from "@mui/icons-material/LockClock";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { classrooms } from "../../mock/classroom";
import { studentClasses } from "../../mock/class";
import { logHistories } from "../../mock/log";
import { schoolYears } from "../../mock/schoolYear";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import TextValueComponent from "components/TextValueComponent";

const data = logHistories.data;

// Class management (UolLT)
export default function LogManagement() {
  //1. Modal form states open, close
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState({});
  const [currentData, setCurrentData] = useState(data);

  const token = localStorage.getItem("authToken");
  const accessToken = `Bearer ${token}`;

  //2. Set data by Call API
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  //5. Functions handle editing
  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  };
  const handleEdit = (rowItem) => {
    if (rowItem) {
      console.log(rowItem);
      setModalEditOpen(true);
      setCurrentLog(rowItem);
    } else {
      setModalEditOpen(false);
    }
  };
  const handleStatistic = () => {
    console.log("Call api: ", { schoolYear });
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterStudentClasses(txtSearch, data));
  };

  const filterStudentClasses = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((item) => {
      return (
        item.title.toLowerCase().includes(search) ||
        item.note.toLowerCase().includes(search) ||
        item.accountID.toLowerCase().includes(search)
      );
    });
  };

  const renderStyleByLogType = (logType) => {
    let logTypeStyle = "";
    switch (logType) {
      case "CREATE":
        logTypeStyle = "success-color font-medium";
        break;
      case "UPDATE":
        logTypeStyle = "warning-color font-medium";
      case "DELETE":
        logTypeStyle = "error-color font-medium";
      default:
        logTypeStyle = "success-color font-medium";
    }
    return logTypeStyle;
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">GHI LOG</h4>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            {/* School Year Select */}
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable">Năm học</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-11 mr-0"
                  label="Năm học"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {schoolYears.data.map((item, index) => (
                    <MenuItem key={index} value={item.schoolYear.toString()}>
                      {item.schoolYear.toString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:mt-2 ml-3">
                <ButtonComponent type="success" onClick={handleStatistic}>
                  <FilterAltIcon className="" /> Tìm kiếm
                </ButtonComponent>
              </div>
            </div>
            <div className="flex justify-end items-center sm:w-full sm:flex-wrap ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
            </div>
          </div>
          <div>
            <TableComponent
              header={["Tài khoản", "Loại thao tác", "Tên thao tác", "Ghi chú", "Thời gian"]}
              data={data.map((item) => [
                item.accountID.toString(),
                item.type.toString(),
                item.title.toString(),
                item.note.toString(),
                item.date.toString(),
              ])}
              itemsPerPage={4}
              onDetails={handleEdit}
              className="mt-8"
            />
            <PopupComponent
              title="CHI TIẾT"
              description="Chi tiết lịch sử ghi log"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={handleCloseEditModal}
            >
              <div className="max-w-md">
                <TextValueComponent
                  label="Thời gian"
                  value={currentLog[4]}
                  icon={<AccessAlarmIcon />}
                />
                <TextValueComponent
                  label="Người dùng"
                  value={currentLog[0]}
                  icon={<AccountCircleIcon />}
                />
                <TextValueComponent
                  label="Loại thao tác"
                  value={currentLog[1]}
                  icon={<AccessAlarmIcon />}
                  customValue={renderStyleByLogType(currentLog[1])}
                />
                <TextValueComponent
                  label="Tên thao tác"
                  value={currentLog[1]}
                  icon={<AccessAlarmIcon />}
                  customValue={renderStyleByLogType(currentLog[1])}
                />
                <TextValueComponent
                  label="Ghi chú"
                  value={currentLog[3]}
                  icon={<AccountCircleIcon />}
                />
              </div>
            </PopupComponent>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
