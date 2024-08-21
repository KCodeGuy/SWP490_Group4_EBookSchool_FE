import React, { useEffect, useState } from "react";
import { Card, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CheckIcon from "@mui/icons-material/Check";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TableComponent from "../../components/TableComponent/TableComponent";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAttendanceBySlot, updateAttendance } from "../../services/AttendanceService";
import { useParams } from "react-router-dom";
import GradingIcon from "@mui/icons-material/Grading";
import { useToasts } from "react-toast-notifications";

export default function TakeAttendance() {
  const { addToast } = useToasts();
  const { attendanceID } = useParams();
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [currentSubject, setCurrentSubject] = useState({});
  let accessToken, currentUser, userRole;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    currentUser = JSON.parse(localStorage.getItem("user"));
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
        teacher: data[0]?.teacher,
        subject: data[0]?.subject,
        date: data[0]?.date,
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
          addToast("Điểm danh thành công!", {
            appearance: "success",
          });
        } else {
          addToast(`Điểm danh thất bại! ${response?.response?.data}`, {
            appearance: "error",
          });
        }
      },
    }
  );

  const handleSaveData = (rowItem) => {
    const { checkedItems, checkedItemsConfirm, inputValues } = rowItem;

    if (!Array.isArray(checkedItems) || !Array.isArray(checkedItemsConfirm)) {
      console.log("checkedItems or checkedItemsConfirm is not an array");
      return;
    }

    const attendedStudentIDs = new Set(checkedItems.map((item) => item[0]));
    const confirmedStudentIDs = new Set(checkedItemsConfirm.map((item) => item[0]));

    const result = currentData?.map((student, index) => ({
      attendenceID: student.attendenceID,
      present: attendedStudentIDs.has(student.attendenceID),
      confirmed: confirmedStudentIDs.has(student.attendenceID),
      note: inputValues[index] || student.note, // Include the updated note here
    }));

    const today = new Date();

    // Parse the date from `currentData[0]?.date` (assuming the format is dd/mm/yyyy)
    const dateParts = currentData[0]?.date.split("/");
    const dateEdit = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

    // Calculate the maximum date for updating (3 days from dateEdit)
    const maxUpdateDate = new Date(dateEdit);
    maxUpdateDate.setDate(dateEdit.getDate() + 2);

    // console.log("today", today);
    // console.log("dateEdit", dateEdit);
    // console.log("maxUpdateDate", maxUpdateDate);

    if (today > maxUpdateDate) {
      // If today is past the maxUpdateDate, show error message
      addToast(
        `Điểm danh thất bại. Thời gian cập nhật điểm danh từ ngày "${
          currentData[0]?.date
        }" đến ngày "${maxUpdateDate.toLocaleDateString("en-GB")}"!`,
        {
          appearance: "error",
        }
      );
    } else if (dateEdit <= today) {
      if (result) {
        updateAttendanceMutation.mutate(result);
      }
    } else {
      addToast(`Điểm danh thất bại. Tiết học bắt đầu vào ngày "${currentData[0]?.date}"!`, {
        appearance: "error",
      });
    }
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
                <h4 className="text-xl font-bold ml-3 max-[639px]:w-44">
                  ĐIỂM DANH MÔN {currentSubject?.subject?.toUpperCase()}
                </h4>
              ) : (
                <h4 className="text-xl font-bold ml-3">ĐIỂM DANH</h4>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-10 flex-wrap max-[639px]:mt-4">
            <div className="flex flex-wrap">
              <div className="text-sm mr-4 max-[639px]:mb-4">
                <span className="mr-2 font-bold">GVBM:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentSubject?.teacher || "Chưa có thông tin!"}
                </span>
              </div>

              <div className="text-sm max-[639px]:mb-4">
                <span className="mr-2 font-bold">Ngày:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentSubject?.date || "Chưa có thông tin!"}
                </span>
              </div>
              <div className="text-sm ml-4 max-[639px]:mb-4">
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
              header={["Mã học sinh", "Tên học sinh", "Hình ảnh", "Môn học", "Trạng thái"]}
              data={currentData?.map((item) => [
                item.attendenceID.toString(),
                item.studentID.toString(),
                item.studentName.toString(),
                item.avatar.toString(),
                item.subject.toString(),
                item.status.toString(),
                item.note.toString(),
              ])}
              onCheckboxChange={handleChecked}
              showCheckboxes={true}
              isMaxLine={false}
              isShowNote={true}
              showCheckboxesConfirm={true}
              className="mt-4"
              itemsPerPage={100}
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
                <span className="warning-color font-bold">(Vắng có phép): </span>
                <span className="italic">
                  Học sinh/Giáo viên đã không tham gia tiết học và có phép.
                </span>
              </li>
              <li>
                <span className="error-color font-bold">(Vắng không phép): </span>
                <span className="italic">
                  Học sinh/Giáo viên đã không tham gia tiết học và không có phép.
                </span>
              </li>
              <li>
                <span className="text-color font-bold">Lưu ý: </span>
                <span className="italic">Thông tin điểm danh chỉ được cập nhật trong 3 ngày!</span>
              </li>
            </ul>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
