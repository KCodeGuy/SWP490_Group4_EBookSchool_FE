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
  const [currentData, setCurrentData] = useState([]);
  const [currentSubject, setCurrentSubject] = useState({});
  let accessToken,
    currentUser,
    userRole,
    userID,
    numberOfSlotInWeek = 0;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    currentUser = JSON.parse(localStorage.getItem("user"));
    userID = currentUser.id;
  }

  const queryClient = useQueryClient();

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["timetable", { accessToken, attendanceID }],
    queryFn: () => getAttendanceBySlot(accessToken, attendanceID),
    // enabled: false,
  });

  useEffect(() => {
    if (data) {
      setCurrentSubject({
        teacher: data[0].teacher,
        subject: data[0].subject,
        date: data[0].date,
      });
      setCurrentData(data);
    }
  }, [data]);

  const handleChecked = (rowItem) => {
    // console.log("checked:", rowItem);
    // Implement delete logic here
  };

  const updateAttendanceMutation = useMutation(
    (attendanceData) => updateAttendance(accessToken, attendanceData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("attendanceData");
        if (response && response.status == 200) {
          refetch().then((result) => {
            if (result?.data) {
              setCurrentData(result?.data);
            }
          });
          toast.success("Điểm danh thành công!");
        } else {
          toast.error(`Điểm danh thất bại! ${response?.response?.data}`);
        }
      },
    }
  );

  const handleSaveData = (rowItem) => {
    const { checkedItems, checkedItemsConfirm } = rowItem;

    // console.log("rowItem", rowItem);
    // console.log("checkedItems", checkedItems);
    // console.log("checkedItemsConfirm", checkedItemsConfirm);
    // console.log("currentData", currentData);

    // Ensure checkedItems and checkedItemsConfirm are arrays
    if (!Array.isArray(checkedItems) || !Array.isArray(checkedItemsConfirm)) {
      console.error("checkedItems or checkedItemsConfirm is not an array");
      return;
    }

    // Create a set of IDs from checkedItems and checkedItemsConfirm for quick lookup
    // Extract IDs from the arrays (assuming they are already arrays of IDs)
    const attendedStudentIDs = new Set(checkedItems.map((item) => item[0]));
    const confirmedStudentIDs = new Set(checkedItemsConfirm.map((item) => item[0]));

    // console.log("attendedStudentIDs", attendedStudentIDs);
    // console.log("confirmedStudentIDs", confirmedStudentIDs);

    // Filter and map the currentData based on the presence in attendedStudentIDs and confirmedStudentIDs
    const result = currentData.map((student) => ({
      attendenceID: student.attendenceID,
      present: attendedStudentIDs.has(student.attendenceID),
      confirmed: confirmedStudentIDs.has(student.attendenceID),
    }));

    // Call the mutation to update attendance data
    updateAttendanceMutation.mutate(result);
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="text-center mt-10 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <GradingIcon />
              {currentSubject ? (
                <h4 className="text-xl font-bold ml-3">
                  ĐIỂM DANH MÔN {currentSubject?.subject?.toUpperCase()}
                </h4>
              ) : (
                <h4 className="text-xl font-bold ml-3">ĐIỂM DANH</h4>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-10 flex-wrap max-[767px]:mt-4">
            <div className="flex max-[767px]:mb-4">
              <div className="text-sm mr-4">
                <span className="mr-2 font-bold">Gíáo viên:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentSubject?.teacher || "Chưa có thông tin!"}
                </span>
              </div>

              <div className="text-sm">
                <span className="mr-2 font-bold">Ngày:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentSubject?.date || "Chưa có thông tin!"}
                </span>
              </div>
              <div className="text-sm ml-4">
                <span className="mr-2 font-bold">Môn:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentSubject?.subject || "Chưa có thông tin"}
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
                "Trạng thái",
                "Vắng phép",
              ]}
              data={currentData?.map((item) => [
                item.attendenceID.toString(),
                item.studentID.toString(),
                item.studentName.toString(),
                item.avatar.toString(),
                item.subject.toString(),
                item.status.toString(),
              ])}
              onCheckboxChange={handleChecked}
              showCheckboxes={true}
              showCheckboxesConfirm={true}
              className="mt-4"
              itemsPerPage={30}
              onSave={handleSaveData}
              isImage={3}
              hiddenColumns={[0]}
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

          <div className="mt-5 text-base">
            <p className="font-bold">Ghi chú:</p>
            <ul className="list-disc ml-5">
              <li>
                <span className="text-color font-bold">(Chưa bắt đầu): </span>
                <span className="italic">
                  Tiết học này chưa bắt đầu, tiết học sẽ bắt đầu khi đến ngày học.
                </span>
              </li>
              <li>
                <span className="success-color font-bold">(Có mặt): </span>
                <span className="italic">Học sinh/Giáo viên đã tham gia tiết học.</span>
              </li>
              <li>
                <span className="error-color font-bold">(Vắng): </span>
                <span className="italic">Học sinh/Giáo viên đã không tham gia tiết học.</span>
              </li>
            </ul>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
