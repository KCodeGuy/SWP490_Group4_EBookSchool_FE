import React, { useEffect, useState } from "react";
import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CheckIcon from "@mui/icons-material/Check";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TableComponent from "../../components/TableComponent/TableComponent";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { students } from "../../mock/student";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { studentClasses } from "../../mock/class";
import { schoolYears } from "../../mock/schoolYear";
import { studentWeeklyTimeTableDates, timeTablesAllSchool } from "../../mock/weeklyTimeTable";
import SearchInputComponent from "components/SearchInputComponent/SearchInputComponent";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAttendanceBySlot, updateAttendance } from "../../services/AttendanceService";
import { useParams } from "react-router-dom";
import GradingIcon from "@mui/icons-material/Grading";

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

export default function TakeAttendance() {
  const { attendanceID } = useParams();
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const [currentData, setCurrentData] = useState([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const accessToken = localStorage.getItem("authToken");
  const queryClient = useQueryClient();

  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["timetable", { accessToken, attendanceID }],
    queryFn: () => getAttendanceBySlot(accessToken, attendanceID),
    // enabled: false,
  });

  useEffect(() => {
    if (data?.success) {
      setCurrentSubject(data?.data[0].subject);
      setCurrentData(data?.data);
    }
  }, [data]);

  const handleFindSlotAttendance = () => {
    refetch().then((result) => {
      if (result?.data.success) {
        setCurrentSubject(result?.data.data[0].subject);
        setCurrentData(result?.data.data);
      }
    });
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

  const updateAttendanceMutation = useMutation(
    (attendanceData) => updateAttendance(accessToken, attendanceData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("attendanceData");
        if (response && response.success) {
          refetch().then((result) => {
            if (result?.data.success) {
              setCurrentData(result?.data.data);
            }
          });
          toast.success("Điểm danh thành công!");
        } else {
          toast.error(`${response.data}!`);
        }
      },
    }
  );

  const handleSaveData = (rowItem) => {
    const attendedStudentIDs = rowItem.map((student) => student[0]);
    const result = currentData
      ?.filter((student) => attendedStudentIDs.includes(student.attendenceID))
      .map((student) => ({
        attendenceID: student.attendenceID,
        present: true,
      }));
    console.log(result);
    updateAttendanceMutation.mutate(result);
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterStudentClasses(txtSearch, currentData));
  };

  const filterStudentClasses = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((student) => {
      return (
        student.studentID.toLowerCase().includes(search) ||
        student.studentName.toString().toLowerCase().includes(search) ||
        student.status.toLowerCase().includes(search)
      );
    });
  };
  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
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
              <ButtonComponent type="success" onClick={handleFindSlotAttendance}>
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
            </div>
            <SearchInputComponent
              onSearch={handleChangeSearchValue}
              placeHolder="Nhập từ khóa..."
              className="mr-3"
            />
          </div>
          <div className="text-center mt-10 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <GradingIcon />
              {currentSubject ? (
                <h4 className="text-xl font-bold ml-3">
                  ĐIỂM DANH MÔN {currentSubject?.toUpperCase()}
                </h4>
              ) : (
                <h4 className="text-xl font-bold ml-3">ĐIỂM DANH</h4>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-10 flex-wrap max-[767px]:mt-4">
            <div className="flex max-[767px]:mb-4">
              <div className="text-sm mr-4">
                <span className="mr-2 font-bold">GVCN:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  Le Van A
                </span>
              </div>

              <div className="text-sm">
                <span className="mr-2 font-bold">Ngày:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  12/06/2024
                </span>
              </div>
              <div className="text-sm ml-4">
                <span className="mr-2 font-bold">Môn:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentSubject || "Chưa có môn"}
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
          {isLoading ? (
            <div className="text-center primary-color my-10 text-xl italic font-medium">
              <div className="mx-auto flex items-center justify-center">
                <p className="mr-3">Loading</p>
                <CircularProgress size={24} color="inherit" />
              </div>
            </div>
          ) : currentData && currentData?.length > 0 ? (
            <TableComponent
              header={[
                "Mã học sinh",
                "Tên học sinh",
                "Hình ảnh",
                "Môn học",
                "Điểm danh",
                "Trạng thái",
              ]}
              data={currentData?.map((item) => [
                item.attendenceID.toString(),
                item.studentID.toString(),
                item.studentName.toString(),
                item.avatar.toString(),
                item.subject.toString(),
                item.status.toString(),
                item.present.toString(),
              ])}
              onCheckboxChange={handleChecked}
              showCheckboxes={true}
              className="mt-4"
              itemsPerPage={30}
              onSave={handleSaveData}
              isImage={3}
              hiddenColumns={[0]}
              // isShowImage={true}
              isCheckedAll={isCheckedAll}
              saveName="ĐIỂM DANH"
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
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
