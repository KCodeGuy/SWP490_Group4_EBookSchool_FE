import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "@mui/material/Card";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useForm } from "react-hook-form";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent.jsx";
import Footer from "../../examples/Footer/index.js";
import LockClockIcon from "@mui/icons-material/LockClock";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { formatDateYearsMonthsDates } from "utils/CommonFunctions";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import TableRegisterBookComponent from "../../components/TableRegisterBookComponent/index.jsx";
import PopupComponent from "../../components/PopupComponent/PopupComponent.jsx";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent.jsx";
import { generateSchoolWeeks } from "../../utils/CommonFunctions.jsx";
import { isTodayInSchoolYear } from "../../utils/CommonFunctions.jsx";
import { getWeekForDate } from "../../utils/CommonFunctions.jsx";
import { getTodayDate } from "../../utils/CommonFunctions.jsx";
import {
  getRegisterNotebook,
  updateRegisterNotebook,
} from "../../services/RegisterNotebookService.jsx";
import { generateClasses } from "utils/CommonFunctions.jsx";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm/index.jsx";
import TextValueComponent from "../../components/TextValueComponent/index.jsx";
import { SUBJECT_ROLE } from "services/APIConfig.jsx";

const SchoolBook = () => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [openModalEditSchoolBook, setOpenModalEditSchoolBook] = useState(false);
  const [currentRegisterNotebook, setCurrentRegisterNotebook] = useState({});
  const [currentSlot, setCurrentSlot] = useState({});
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  let accessToken, currentUser, userRole, userID, schoolYearsAPI, classesAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    classesAPI = JSON.parse(localStorage.getItem("currentClasses"));
    currentUser = JSON.parse(localStorage.getItem("user"));
    userID = currentUser.id;
  }

  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const { today } = getTodayDate();

  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const classesOfSchoolYear = generateClasses(classesAPI, schoolYear);
  const [currentClass, setCurrentClass] = useState(classesOfSchoolYear[0]?.Classroom);

  const [schoolClass, setSchoolClass] = React.useState(classesOfSchoolYear[0]?.ID);
  const handleChangeClass = (event) => {
    setSchoolClass(event.target.value);
    let currentClass = "";
    classesAPI.forEach((item) => {
      item.details.forEach((item) => {
        if (item.ID === event.target.value) {
          currentClass = item.Classroom;
        }
      });
    });
    setCurrentClass(currentClass);
  };

  const schoolWeeks = generateSchoolWeeks(schoolYear);

  let currentWeek;
  if (isTodayInSchoolYear(schoolYear)) {
    currentWeek = getWeekForDate(schoolWeeks, today);
  }

  const [currentWeekDate, setCurrentWeekDate] = useState(currentWeek);

  const [schoolWeek, setSchoolWeek] = React.useState(currentWeekDate?.startTime);
  const handleSchoolWeeksSelectedChange = (event) => {
    setSchoolWeek(event.target.value);
  };

  const handleViewSlotDetail = (slot) => {
    if (slot) {
      // console.log(slot);
      setCurrentSlot(slot);
      setValue("id", slot.id);
      setValue("dateEdit", formatDateYearsMonthsDates(slot.date));
      setValue("weekDateEdit", slot.weekDate);
      setValue("slotEdit", slot.slot);
      setValue("subjectEdit", slot.subject);
      setValue("teacherEdit", slot.teacher);
      setValue("slotByLessonPlansEdit", slot.slotByLessonPlans);
      setValue("numberOfAbsentEdit", slot.numberOfAbsent);
      setValue("titleEdit", slot.title);
      setValue("noteEdit", slot.note);
      setValue("ratingEdit", slot.rating);
      setOpenModalEditSchoolBook(true);
    } else {
      setOpenModalEditSchoolBook(false);
    }
  };

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["schoolBook", { userID, userRole, accessToken, schoolWeek, schoolClass }],
    queryFn: () => getRegisterNotebook(userID, userRole, accessToken, schoolWeek, schoolClass),
    enabled: false,
  });

  const formatRegisterNotebook = (registerNotebook) => {
    const transformedData = [];
    if (registerNotebook.length > 0) {
      registerNotebook.forEach((detail) => {
        const date = detail.date;
        const weekDate = detail.weekDate;
        const countSlots = detail.slots.length;

        if (countSlots === 0) {
          transformedData.push({
            id: detail.id,
            date: date,
            weekDate: weekDate,
            slots: [],
            countSlots: countSlots,
          });
        } else {
          detail.slots.forEach((slot) => {
            const transformedSlot = {
              id: slot.id,
              date: date,
              weekDate: weekDate,
              slot: slot.slot,
              subject: slot.subject,
              teacher: slot.teacher,
              slotByLessonPlan: slot.slotByLessonPlan,
              numberOfAbsent: slot.numberOfAbsent,
              numberAbsent: slot.numberAbsent,
              title: slot.title,
              note: slot.note,
              rating: slot.rating,
              countSlots: countSlots,
            };
            transformedData.push(transformedSlot);
          });
        }
      });
    }
    return transformedData;
  };

  useEffect(() => {
    if (schoolWeeks && isFirstRender) {
      refetch().then((result) => {
        if (result?.data) {
          const transformedData = formatRegisterNotebook(result.data?.details);
          setCurrentRegisterNotebook(transformedData);
        }
      });
    }
    setIsFirstRender(false);
  }, [schoolWeeks, isFirstRender]);

  const handleFilterTimetable = () => {
    setIsFirstRender(false);
    refetch().then((result) => {
      if (result.data) {
        const transformedData = formatRegisterNotebook(result.data?.details);
        setCurrentRegisterNotebook(transformedData);
      }
    });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalItems = schoolWeeks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const updateSlotRegisterNotebookMutation = useMutation(
    (slotData) => updateRegisterNotebook(accessToken, slotData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("slotData");
        if (response) {
          refetch().then((result) => {
            const transformedData = formatRegisterNotebook(result.data?.details);
            setCurrentRegisterNotebook(transformedData);
          });
          toast.success("Cập nhật tiết học thành công!");
        } else {
          toast.error(`${response.data}!`);
        }
        resetEditAction();
        setOpenModalEditSchoolBook(false);
      },
    }
  );

  const handleEvaluateSlot = (data) => {
    const evaluateSlotDate = {
      id: data.id,
      note: data.noteEdit,
      rating: data.ratingEdit,
    };
    updateSlotRegisterNotebookMutation.mutate(evaluateSlotDate);
  };

  const renderRatingStyle = (rating) => {
    let defaultStyles = "";
    switch (rating) {
      case "A": {
        defaultStyles = "success";
        break;
      }
      case "B": {
        defaultStyles = "primary";
        break;
      }
      case "C": {
        defaultStyles = "warning";
        break;
      }
      case "D": {
        defaultStyles = "error";
        break;
      }
    }
    return defaultStyles;
  };

  const renderRatingValue = (rating) => {
    let value = "";
    switch (rating) {
      case "A": {
        value = "tốt";
        break;
      }
      case "B": {
        value = "khá";
        break;
      }
      case "C": {
        value = "trung bình";
        break;
      }
      case "D": {
        value = "kém";
        break;
      }
    }
    return value;
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="mb-8 min-h-full">
        <MDBox p={5}>
          <div className="flex justify-between items-center">
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
                  {schoolYearsAPI?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
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
                  onChange={handleChangeClass}
                >
                  {classesOfSchoolYear?.map((item, index) => (
                    <MenuItem key={index} value={item.ID}>
                      {item.Classroom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-week-lable">Tuần</InputLabel>
                <Select
                  labelId="select-school-week-lable"
                  id="select-school-week"
                  value={schoolWeek}
                  className="h-10 mr-2 max-[767px]:mb-4"
                  label="Tuần"
                  onChange={handleSchoolWeeksSelectedChange}
                >
                  {schoolWeeks.map((item, index) => (
                    <MenuItem key={index} value={item.startTime}>
                      {item.startTime} - {item.endTime}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ButtonComponent type="success" onClick={handleFilterTimetable}>
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
            </div>
            {/* <div className="flex items-center">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
                className="mr-3"
              />
            </div> */}
          </div>
          <div className="text-center mt-10 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <AssignmentIcon />
              <h4 className="text-xl font-bold ml-3">SỔ GHI ĐẦU BÀI LỚP {currentClass}</h4>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-sm">
              <span className="mr-2 font-bold">Giáo viên:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                {currentUser?.fullname}
              </span>
            </div>
            <div className="text-sm">
              <span className="mr-2 font-bold">Năm học:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                {schoolYear}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center primary-color my-10 text-xl italic font-medium">
              <div className="mx-auto flex items-center justify-center">
                <p className="mr-3">Loading</p>
                <CircularProgress size={24} color="inherit" />
              </div>
            </div>
          ) : data && currentRegisterNotebook.length > 0 ? (
            <TableRegisterBookComponent
              header={[
                "Ngày",
                "Tiết",
                "Môn học",
                "GV bộ môn",
                "Tiết theo môn",
                "Vắng",
                "Nội dung",
                "Nhận xét",
                "Xếp loại",
              ]}
              itemsPerPage={70}
              isPaginated={false}
              onEdit={handleViewSlotDetail}
              data={currentRegisterNotebook}
              onDetails={handleViewSlotDetail}
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
          <div className="mt-5 text-base">
            <p className="font-bold">Ghi chú:</p>
            <ul className="list-disc ml-5">
              <li>
                <span className="success-color">(A): </span>
                <span className="italic">Tiết tích cực, tốt.</span>
              </li>
              <li>
                <span className="primary-color">(B): </span>
                <span className="italic">Tiết học khá.</span>
              </li>
              <li>
                <span className="warning-color">(C): </span>
                <span className="italic">Tiết Trung bình.</span>
              </li>
              <li>
                <span className="error-color">(D): </span>
                <span className="italic">Tiết học kém.</span>
              </li>
            </ul>
          </div>
          <PopupComponent
            title={userRole.includes(SUBJECT_ROLE) ? "ĐÁNH GIÁ TIẾT HỌC" : "CHI TIẾT SỔ"}
            description={`GVBM: ${currentUser?.fullname}`}
            rightNote={`Lớp: ${currentClass}`}
            icon={<BorderColorIcon />}
            isOpen={openModalEditSchoolBook}
            onClose={() => setOpenModalEditSchoolBook(false)}
          >
            <form onSubmit={handleSubmitEditAction(handleEvaluateSlot)}>
              <TextValueComponent
                label="Môn học"
                className="justify-between"
                value={currentSlot.subject}
                icon={<AutoStoriesIcon />}
                customValue="text-black font-medium"
              />
              <TextValueComponent
                label="Ngày"
                value={currentSlot.date}
                icon={<EventAvailableIcon />}
              />
              <TextValueComponent
                label="Tiết học"
                value={`Tiết ${currentSlot.slot}`}
                icon={<LockClockIcon />}
              />
              <TextValueComponent
                label="Tiết giáo án"
                value={`Tiết ${currentSlot.slotByLessonPlan}`}
                icon={<LockClockIcon />}
              />
              <TextValueComponent
                label="Bài học"
                maxWidth="w-64 max-w-md"
                value={currentSlot.title}
                icon={<AssignmentIcon />}
              />
              <TextValueComponent
                label="Số lượng vắng"
                value={`${currentSlot.numberOfAbsent} học sinh`}
                icon={<EventAvailableIcon />}
              />
              <TextValueComponent
                maxWidth="w-64 max-w-md"
                label="Học sinh vắng"
                value={currentSlot.numberAbsent?.join(", ") || "Không có học sinh vắng!"}
                icon={<PersonOffIcon />}
              />
              {/* </div> */}
              {userRole.includes(SUBJECT_ROLE) ? (
                <>
                  <InputBaseComponent
                    name="id"
                    className="hidden"
                    placeholder="Đánh giá về tiết học"
                    type="text"
                    control={controlEditAction}
                    setValue={setValue}
                    label="ID"
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    name="ratingEdit"
                    label="Xếp loại tiết"
                    className="w-full"
                    control={controlEditAction}
                    setValue={setValue}
                    type="select"
                    options={[
                      { id: 1, label: "Loại A (Tốt)", value: "A" },
                      { id: 2, label: "Loại B (Khá)", value: "B" },
                      { id: 3, label: "Loại C (Trung bình)", value: "C" },
                      { id: 4, label: "Loại D (Kém)", value: "D" },
                    ]}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Hãy xếp loại tiết!",
                    }}
                  />
                  <InputBaseComponent
                    name="noteEdit"
                    placeholder="Nhận xét về tiết học..."
                    type="textArea"
                    className="max-w-md"
                    control={controlEditAction}
                    setValue={setValue}
                    label="Nhập xét"
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi đánh giá!" />
                  <div className="mt-4 flex justify-end">
                    <ButtonComponent
                      type="success"
                      action="button"
                      className="mx-2"
                      onClick={() => {
                        navigate(`/takeAttendance/${currentSlot.id}`);
                      }}
                    >
                      <BorderColorIcon className="mr-2" />
                      ĐIỂM DANH
                    </ButtonComponent>
                    <ButtonComponent action="submit">
                      <BorderColorIcon className="text-3xl mr-2" />
                      ĐÁNH GIÁ
                    </ButtonComponent>
                  </div>
                </>
              ) : (
                <>
                  <TextValueComponent
                    label="Nhận xét"
                    maxWidth="w-64 max-w-md"
                    value={currentSlot.note ? currentSlot.note : "Chưa nhận xét!"}
                    icon={<BorderColorIcon />}
                  />
                  <TextValueComponent
                    label="Đánh giá"
                    value={
                      currentSlot.rating
                        ? `${currentSlot.rating} (tiết học ${renderRatingValue(
                            currentSlot.rating
                          )})`
                        : "Chưa đánh giá!"
                    }
                    icon={<BorderColorIcon />}
                    variantValue={renderRatingStyle(currentSlot.rating)}
                  />
                </>
              )}
            </form>
          </PopupComponent>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};
export default SchoolBook;
