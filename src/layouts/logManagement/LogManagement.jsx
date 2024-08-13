import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { schoolYears } from "../../mock/schoolYear";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import TextValueComponent from "components/TextValueComponent";
import { getAllLogs } from "services/LogService";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";

const logActions = [
  { label: "TẠO", value: "CREATE" },
  { label: "CẬP NHẬT", value: "UPDATE" },
  { label: "XÓA", value: "DELETE" },
  { label: "KHÁC", value: "OTHERS" },
];
const accessToken = localStorage.getItem("authToken");

// Class management (UolLT)
export default function LogManagement() {
  //1. Modal form states open, close
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState(logActions[0]);
  const [currentData, setCurrentData] = useState([]);

  // Get query parameters
  const { id } = useParams();

  const { data, error, isLoading } = useQuery(["logState", { accessToken }], () =>
    getAllLogs(accessToken)
  );

  useEffect(() => {
    if (data) {
      if (id) {
        setCurrentData(filterLogDetailsByID(id, data));
      } else {
        setCurrentData(data);
      }
    }
  }, [data, id]);

  //2. Set data by Call API
  const [logAction, setLogAction] = React.useState(logActions[0].value);
  const handleLogChange = (event) => {
    setLogAction(event.target.value);
  };

  //5. Functions handle editing
  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  };
  const handleEdit = (rowItem) => {
    if (rowItem) {
      setModalEditOpen(true);
      setCurrentLog(rowItem);
    } else {
      setModalEditOpen(false);
    }
  };
  const handleStatistic = () => {
    setCurrentData(filterLogByAction(logAction, data));
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterLog(txtSearch, data));
  };

  const filterLog = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    if (data) {
      return data.filter((item) => {
        return (
          item.id.toLowerCase().includes(search) ||
          item.type.toLowerCase().includes(search) ||
          item.note.toLowerCase().includes(search) ||
          item.date.toLowerCase().includes(search)
        );
      });
    }
  };

  const filterLogDetailsByID = (id, data) => {
    if (data) {
      return data.filter((item) => {
        return item.id == id;
      });
    }
  };

  const filterLogByAction = (action, data) => {
    if (data) {
      return data.filter((item) => {
        return item.type.toLowerCase() === action.toLowerCase();
      });
    }
  };

  const renderStyleByLogType = (logType) => {
    let logTypeStyle = "";
    switch (logType) {
      case "TẠO":
        logTypeStyle = "success-color font-medium";
        break;
      case "CẬP NHẬT":
        logTypeStyle = "warning-color font-medium";
      case "XÓA":
        logTypeStyle = "error-color font-medium";
      default:
        logTypeStyle = "success-color font-medium";
    }
    return logTypeStyle;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="flex justify-center items-center text-3xl mx-auto w-full">
            <HistoryIcon />
            <h4 className="text-xl font-bold ml-3">GHI LOG</h4>
          </div>
          <div className="mt-4 grid max-[693px]:grid-cols-1 sm:grid-cols-2 gap-1 max-[693px]:mt-6">
            {/* School Year Select */}
            <div className="flex justify-start max-[639px]:flex-wrap flex-nowrap">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable">Thao tác</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={logAction}
                  className="h-11 mr-0"
                  label="Thao tác"
                  onChange={handleLogChange}
                >
                  {logActions.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label.toString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:w-full max-[639px]:ml-0 mt-3 ml-2 sm:mt-0">
                <ButtonComponent
                  className="max-[639px]:w-full"
                  type="success"
                  onClick={handleStatistic}
                >
                  <FilterAltIcon className="" /> TÌM KIẾM
                </ButtonComponent>
              </div>
            </div>
            <div className="w-full flex justify-end max-[639px]:justify-between items-center mt-3 sm:mt-0">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="text-center primary-color my-10 text-xl italic font-medium">
                <div className="mx-auto flex items-center justify-center">
                  <p className="mr-3">Loading</p>
                  <CircularProgress size={24} color="inherit" />
                </div>
              </div>
            ) : data && currentData.length > 0 ? (
              <TableComponent
                header={["Mã log", "Loại thao tác", "Ghi chú", "Thời gian"]}
                data={currentData?.map((item) => [
                  item.id.toString(),
                  item.type.toString() == "CREATE"
                    ? "TẠO"
                    : item.type.toString() == "UPDATE"
                    ? "CẬP NHẬT"
                    : item.type.toString() == "DELETE"
                    ? "XÓA"
                    : "KHÁC",
                  item.note.toString(),
                  item.date.toString(),
                ])}
                itemsPerPage={20}
                onDetails={handleEdit}
                className="mt-8"
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
              title="CHI TIẾT"
              description="Chi tiết lịch sử ghi log"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={handleCloseEditModal}
            >
              <div className="max-w-md">
                <TextValueComponent
                  label="Mã log"
                  value={currentLog[0]}
                  icon={<AccessAlarmIcon />}
                />
                <TextValueComponent
                  label="Thời gian"
                  value={currentLog[3]}
                  icon={<AccessAlarmIcon />}
                />
                <TextValueComponent
                  label="Thao tác"
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
                  value={currentLog[2]}
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
