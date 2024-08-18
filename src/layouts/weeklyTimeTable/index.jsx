import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LockClockIcon from "@mui/icons-material/LockClock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import TodayIcon from "@mui/icons-material/Today";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import {
  HEADTEACHER_ROLE,
  HOMEROOM_ROLE,
  ORB_HOST,
  PRINCIPAL_ROLE,
  STUDENT_ROLE,
  SUBJECT_ROLE,
} from "../../services/APIConfig";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import TableWeeklyTimeTableComponent from "../../components/TableWeeklyTimeTable";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import TextValueComponent from "../../components/TextValueComponent";
import NotifyCheckInfoForm from "../../components/NotifyCheckInfoForm";
import { schoolYears } from "../../mock/schoolYear";
import {
  countNumberOfSlotsInWeek,
  generateClasses,
  generateSchoolWeeks,
  isXlsxFile,
} from "../../utils/CommonFunctions";
import { getTodayDate } from "../../utils/CommonFunctions";
import { getWeekForDate } from "../../utils/CommonFunctions";
import { formatDateYYYYMMDD, isTodayInSchoolYear } from "../../utils/CommonFunctions";
import {
  addTimeTableByExcel,
  addTimeTableManually,
  deleteSlotOfTimeTable,
  getTimetable,
  updateSlotOfTimeTable,
} from "../../services/TimeTableService";
import { getAllSubjects } from "../../services/SubjectService";
import { getAllTeachers } from "../../services/TeacherService";
import { useToasts } from "react-toast-notifications";
const slotDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function WeeklyTimeTable() {
  const { addToast } = useToasts();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [openModelAdd, setOpenModelAdd] = useState(false);
  const [isUpdateAction, setIsUpdateAction] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentSlot, setCurrentSlot] = useState({});
  const [currentSlotID, setCurrentSlotID] = useState("");
  const [currentSlotDate, setCurrentSlotDate] = useState("");
  const [currentTimeTable, setCurrentTimeTable] = useState([]);
  const [currentSubjects, setCurrentSubjects] = useState([]);
  const [currentTeachers, setCurrentTeachers] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  let accessToken,
    currentUser,
    userRole,
    userID,
    schoolYearsAPI,
    classesAPI,
    numberOfSlotInWeek = 0;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    classesAPI = JSON.parse(localStorage.getItem("currentClasses"));
    currentUser = JSON.parse(localStorage.getItem("user"));
    userID = currentUser.id;
  }

  const [currentTab, setCurrentTab] = useState(0);
  const { today } = getTodayDate();

  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const classesOfSchoolYear = generateClasses(classesAPI, schoolYear);

  const [schoolClass, setSchoolClass] = React.useState(classesOfSchoolYear[0]?.Classroom);
  const handleChangeClass = (event) => {
    setSchoolClass(event.target.value);
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
  let formattedSubjects;
  if (schoolClass.toString().includes("12")) {
    formattedSubjects = currentSubjects
      .filter((subject) => subject.grade === "12" || subject.grade === "Môn chung")
      .map((item) => ({
        label: `${item.name}`,
        value: item.id,
      }));
  } else if (schoolClass.toString().includes("11")) {
    formattedSubjects = currentSubjects
      .filter((subject) => subject.grade === "11" || subject.grade === "Môn chung")
      .map((item) => ({
        label: `${item.name}`,
        value: item.id,
      }));
  } else if (schoolClass.toString().includes("10")) {
    formattedSubjects = currentSubjects
      .filter((subject) => subject.grade === "10" || subject.grade === "Môn chung")
      .map((item) => ({
        label: `${item.name}`,
        value: item.id,
      }));
  }

  // Filter out duplicates by name
  const uniqueSubjects = [];
  const uniqueNames = new Set();

  formattedSubjects?.forEach((item) => {
    if (!uniqueNames.has(item.label)) {
      uniqueNames.add(item.label);
      uniqueSubjects.push(item);
    }
  });

  const formattedClasses = classesOfSchoolYear.map((item) => ({
    label: item.Classroom,
    value: item.ID,
  }));

  const formattedTeachers = currentTeachers?.map((item) => ({
    label: `${item.fullname} (${item.id} )`,
    value: item.id,
  }));
  const formattedSlotByDate = slotDates?.map((item) => ({
    label: `Tiết ${item}`,
    value: item,
  }));

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["timetable", { userID, schoolYear, schoolWeek, accessToken, userRole, schoolClass }],
    queryFn: () => getTimetable(userID, schoolYear, schoolWeek, accessToken, userRole, schoolClass),
    enabled: false,
  });

  const {
    data: subjects,
    error: errorSubjects,
    isLoading: isLoadingSubjects,
    refetch: refetchSubjects,
  } = useQuery({
    queryKey: ["subjectState", { accessToken }],
    queryFn: () => getAllSubjects(accessToken),
    enabled: false,
  });

  const {
    data: teachers,
    error: errorTeachers,
    isLoading: isLoadingTeachers,
    refetch: refetchTeachers,
  } = useQuery({
    queryKey: ["teacherState", { accessToken }],
    queryFn: () => getAllTeachers(accessToken),
    enabled: false,
  });

  useEffect(() => {
    if (schoolYearsAPI && formattedClasses && schoolWeeks && isFirstRender) {
      refetch().then((result) => {
        if (result.data) {
          setCurrentTimeTable(result.data?.details);
        }
      });
      setIsFirstRender(false);
    }
  }, [schoolWeek, isFirstRender]);

  const handleFilterTimetable = () => {
    setIsFirstRender(false);
    setSearchLoading(true); // Start loading
    refetch()
      .then((result) => {
        if (result.data) {
          setCurrentTimeTable(result.data?.details);
        }
        setSearchLoading(false); // End loading
      })
      .catch(() => {
        setSearchLoading(false); // End loading in case of an error
      });
  };

  if (currentTimeTable) {
    numberOfSlotInWeek = countNumberOfSlotsInWeek(currentTimeTable);
  }
  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  // React-hook-form for editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleViewSlotDetail = ([slotDetails, date]) => {
    if (slotDetails) {
      setCurrentSlot(slotDetails);
      setCurrentSlotDate(date);
      setOpenModalDetail(true);
    }
  };

  const handleOpenCreateModal = () => {
    refetchSubjects().then((result) => {
      if (result.data) {
        setCurrentSubjects(result.data);
      }
    });
    refetchTeachers().then((result) => {
      if (result.data) {
        setCurrentTeachers(result.data);
      }
    });
    setIsUpdateAction(false);
    setOpenModelAdd(true);
  };

  const addTimeTableMutationManually = useMutation(
    (slotData) => addTimeTableManually(accessToken, slotData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("timeTableState");
        if (response && response?.status == 200) {
          addToast("Tạo tiết học thành công!", {
            appearance: "success",
          });
          reset();
          refetch().then((result) => {
            if (result.data) {
              setCurrentTimeTable(result.data?.details);
            }
          });
          setOpenModelAdd(false);
        } else {
          addToast(`Tạo tiết học thất bại! ${response?.response?.data}!`, {
            appearance: "error",
          });
        }
      },
      onError: (error) => {
        addToast(`Tạo tiết học thất bại! ${error.message}!`, {
          appearance: "error",
        });
      },
    }
  );

  const handleAddTimetableManually = (data) => {
    if (!data?.subjectID || data?.subjectID === "") {
      data.subjectID = formattedSubjects[0]?.value;
    }
    if (!data?.teacherID || data?.teacherID === "") {
      data.teacherID = formattedTeachers[0].value;
    }
    if (!data?.classID || data?.classID === "") {
      data.classID = formattedClasses[0].value;
    }
    if (!data?.slotByDate || data?.slotByDate === "") {
      data.slotByDate = formattedSlotByDate[0].value;
    }
    addTimeTableMutationManually.mutate(data);
  };

  const addTimeTableMutationByExcel = useMutation(
    (templateFile) => addTimeTableByExcel(accessToken, templateFile),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("timeTableState");
        if (response && response?.status == 200) {
          addToast("Tạo thời khóa biểu thành công!", {
            appearance: "success",
          });
          reset();
          setOpenModelAdd(false);
          refetch().then((result) => {
            if (result.data) {
              setCurrentTimeTable(result.data?.details);
            }
          });
        } else {
          addToast(`Tạo thời khóa biểu thất bại! ${response?.response?.data}!`, {
            appearance: "error",
          });
        }
      },
      onError: (error) => {
        addToast(`Tạo khóa biểu thất bại! ${error.message}!`, {
          appearance: "error",
        });
      },
    }
  );

  const handleAddTimetableByExcel = (data) => {
    if (data) {
      if (isXlsxFile(data?.timeTableFile)) {
        addTimeTableMutationByExcel.mutate(data.timeTableFile);
      } else {
        addToast(`Tạo thời khoá biểu thất bại! File không đúng định dạng ".xlsx"!`, {
          appearance: "error",
        });
      }
    }
  };
  //-----------------------------------------
  const handleEditSlot = (rowItem, slotDate) => {
    if (rowItem) {
      setValue("idEdit", rowItem.id);
      setValue("subjectIDEdit", rowItem.subjectID);
      setValue("teacherIDEdit", rowItem.teacher);
      setValue("slotByLessonPlansEdit", rowItem.slotByLessonPlans);
      setValue("slotByDateEdit", rowItem.slot);
      if (schoolClass) {
        setValue("classIDEdit", getClassIDByClass(schoolClass));
      }
      if (slotDate) {
        setValue("dateEdit", formatDateYYYYMMDD(slotDate));
      }
      // Start call API
      refetchSubjects().then((result) => {
        if (result.data) {
          setCurrentSubjects(result.data);
        }
      });
      refetchTeachers().then((result) => {
        if (result.data) {
          setCurrentTeachers(result.data);
        }
      });
      setCurrentSlot(rowItem);
      setOpenModalUpdate(true);
    } else {
      setOpenModalUpdate(false);
    }
  };

  const updateSlotOfTimetableMutation = useMutation(
    (slotData) => updateSlotOfTimeTable(accessToken, slotData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("slotData");
        if (response && response?.status == 200) {
          resetEditAction();
          setOpenModalUpdate(false);
          refetch().then((result) => {
            if (result.data) {
              setCurrentTimeTable(result.data?.details);
            }
          });
          addToast("Cập nhật tiết học thành công!", {
            appearance: "success",
          });
        } else {
          addToast(`Cập nhật học thất bại! ${response?.response?.data}!`, {
            appearance: "error",
          });
        }
      },
      onError: (error) => {
        addToast(`Cập nhật tiết học thất bại!`, {
          appearance: "error",
        });
      },
    }
  );

  const handleUpdateSlotAPI = (data) => {
    const slotData = {
      id: data.idEdit,
      classID: data.classIDEdit,
      subjectID: data.subjectIDEdit,
      teacherID: data.teacherIDEdit,
      date: data.dateEdit,
      slotByDate: data.slotByDateEdit,
      slotByLessonPlans: data.slotByLessonPlansEdit,
    };
    updateSlotOfTimetableMutation.mutate(slotData);
  };

  const deleteSlotOfTimetableMutation = useMutation(
    (slotID) => deleteSlotOfTimeTable(accessToken, slotID),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("slotData");
        if (response && response.status == 200) {
          addToast("Xóa tiết học thành công!", {
            appearance: "success",
          });
        } else {
          addToast("Xóa tiết học thất bại!", {
            appearance: "error",
          });
        }
        setModalDeleteOpen(false);
        refetch().then((result) => {
          if (result.data) {
            setCurrentTimeTable(result.data?.details);
          }
        });
      },
    }
  );

  const handleDeleteAPI = () => {
    if (currentSlotID) {
      deleteSlotOfTimetableMutation.mutate(currentSlotID);
    }
  };

  const handleDeleteSlot = (rowItem, slotDate) => {
    if (rowItem) {
      setCurrentSlotID(rowItem.id);
      setModalDeleteOpen(true);
    }
  };

  const handleDownloadFile = () => {
    window.location.href = `${ORB_HOST}/Templates/template_schedule.xlsx`;
  };

  const getClassIDByClass = (className) => {
    const classObject = formattedClasses.find((cls) => cls.label === className);
    if (classObject) {
      return classObject.value;
    } else {
      return className;
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable">Năm học</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-10 mr-2 max-[639px]:mb-4"
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
              {userRole.includes(HOMEROOM_ROLE) ||
              userRole.includes(PRINCIPAL_ROLE) ||
              userRole.includes(HEADTEACHER_ROLE) ? (
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="select-school-class-lable">Lớp</InputLabel>
                  <Select
                    labelId="select-school-class-lable"
                    id="select-school-class"
                    value={schoolClass}
                    className="h-10 mr-2 max-[639px]:mb-4"
                    label="Lớp"
                    onChange={handleChangeClass}
                  >
                    {formattedClasses?.map((item, index) => (
                      <MenuItem key={index} value={item.label}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                ""
              )}

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-week-lable">Tuần</InputLabel>
                <Select
                  labelId="select-school-week-lable"
                  id="select-school-week"
                  value={schoolWeek}
                  className="h-10 mr-2 max-[639px]:mb-4"
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
              <ButtonComponent
                type="success"
                className="max-[639px]:w-full "
                onClick={handleFilterTimetable}
              >
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
            </div>

            <div className="">
              {userRole.includes(PRINCIPAL_ROLE) || userRole.includes(HEADTEACHER_ROLE) ? (
                <div className="flex items-center flex-1 max-[890px]:mt-3">
                  <ButtonComponent
                    className=""
                    onClick={() => {
                      setIsUpdateAction(true);
                    }}
                  >
                    <BorderColorIcon className="text-3xl mr-1" />
                    CẬP NHẬT
                  </ButtonComponent>
                  <ButtonComponent type="success" className="" onClick={handleOpenCreateModal}>
                    <AddCircleOutlineIcon className="text-3xl mr-1" />
                    TẠO
                  </ButtonComponent>
                </div>
              ) : (
                ""
              )}
              <PopupComponent
                title="TẠO THỜI KHÓA BIỂU"
                description={`Tạo khóa biểu`}
                // rightNote={`Lớp: ${currentClass}`}
                icon={<AddCircleOutlineIcon />}
                isOpen={openModelAdd}
                onClose={() => setOpenModelAdd(false)}
                tabs={[{ label: "TẠO TIẾT HỌC" }, { label: "TẠO BẰNG EXCEL" }]}
                currentTab={currentTab}
                onTabChange={handleTabChange}
              >
                <div role="tabpanel" hidden={currentTab !== 0}>
                  {isLoadingSubjects || isLoadingTeachers ? (
                    <div className="text-center primary-color my-10 text-xl italic font-medium">
                      <div className="mx-auto flex items-center justify-center">
                        <p className="mr-3">Loading</p>
                        <CircularProgress size={24} color="inherit" />
                      </div>
                    </div>
                  ) : teachers && subjects ? (
                    <form onSubmit={handleSubmit(handleAddTimetableManually)}>
                      <InputBaseComponent
                        name="subjectID"
                        label="Môn học"
                        className="w-full"
                        control={control}
                        setValue={noSetValue}
                        type="select"
                        options={formattedSubjects}
                        errors={errors}
                      />
                      <InputBaseComponent
                        name="teacherID"
                        label="Giáo viên"
                        className="w-full"
                        control={control}
                        setValue={noSetValue}
                        type="select"
                        options={formattedTeachers}
                        errors={errors}
                      />
                      <div className="w-full flex">
                        <InputBaseComponent
                          name="classID"
                          label="Lớp học"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          type="select"
                          options={formattedClasses}
                          errors={errors}
                        />
                        <InputBaseComponent
                          name="slotByDate"
                          label="Tiết học"
                          className="w-1/2"
                          control={control}
                          setValue={noSetValue}
                          type="select"
                          options={formattedSlotByDate}
                          errors={errors}
                        />
                      </div>

                      <div className="flex ">
                        <InputBaseComponent
                          name="date"
                          label="Ngày học"
                          placeholder="Chọn ngày..."
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          type="date"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          name="slotByLessonPlans"
                          label="Tiết theo giáo án"
                          placeholder="Tiết giáo án..."
                          className="w-1/2"
                          control={control}
                          setValue={noSetValue}
                          type="number"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi tạo!" />
                      <div className="flex justify-end mt-4">
                        <ButtonComponent
                          type="error"
                          action="reset"
                          onClick={() => {
                            setOpenModelAdd(false);
                            reset();
                          }}
                        >
                          <CancelIcon className="text-3xl mr-1 mb-0.5" />
                          HỦY BỎ
                        </ButtonComponent>
                        <ButtonComponent action="submit">
                          {addTimeTableMutationManually.isLoading || searchLoading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <>
                              <AddCircleOutlineIcon className="text-3xl mr-1" />
                              TẠO
                            </>
                          )}
                        </ButtonComponent>
                      </div>
                    </form>
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
                </div>
                <div role="tabpanel" hidden={currentTab == 1}>
                  <ButtonComponent action="submit" onClick={handleDownloadFile}>
                    <DownloadIcon className="mr-2" />
                    TẢI XUỐNG
                  </ButtonComponent>
                  <form onSubmit={handleSubmit(handleAddTimetableByExcel)}>
                    <InputBaseComponent
                      name="timeTableFile"
                      label="Thời Khóa biểu(Excel)"
                      className="w-full mt-5"
                      control={control}
                      setValue={noSetValue}
                      type="file"
                      errors={errors}
                      validationRules={{
                        required: "Hãy chọn file!",
                      }}
                    />
                    <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi tạo!" />
                    <div className="mt-5 flex justify-end">
                      <ButtonComponent
                        type="error"
                        action="reset"
                        onClick={() => {
                          setOpenModelAdd(false);
                          reset();
                        }}
                      >
                        <CancelIcon className="text-3xl mr-1 mb-0.5" />
                        HỦY BỎ
                      </ButtonComponent>
                      <ButtonComponent action="submit">
                        {addTimeTableMutationByExcel.isLoading || searchLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <>
                            <AddCircleOutlineIcon className="text-3xl mr-1" />
                            TẠO
                          </>
                        )}
                      </ButtonComponent>
                    </div>
                  </form>
                </div>
              </PopupComponent>
              <PopupComponent
                title="CẬP NHẬT THỜI KHÓA BIỂU"
                description={`Cập nhật khóa biểu bằng Excel`}
                icon={<BorderColorIcon />}
                isOpen={isUpdateAction}
                onClose={() => setIsUpdateAction(false)}
              >
                <div>
                  <ButtonComponent action="submit" onClick={handleDownloadFile}>
                    <DownloadIcon className="mr-2" />
                    TẢI XUỐNG
                  </ButtonComponent>
                  <form onSubmit={handleSubmit(handleAddTimetableByExcel)}>
                    <InputBaseComponent
                      name="timeTableFile"
                      label="Thời Khóa biểu(Excel)"
                      className="w-full mt-5"
                      control={control}
                      setValue={noSetValue}
                      type="file"
                      errors={errors}
                      validationRules={{
                        required: "Hãy chọn file!",
                      }}
                    />
                    <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi cập nhật!" />
                    <div className="mt-5 flex justify-end">
                      <ButtonComponent
                        type="error"
                        action="reset"
                        onClick={() => {
                          setIsUpdateAction(false);
                          reset();
                        }}
                      >
                        <CancelIcon className="text-3xl mr-1 mb-0.5" />
                        HỦY BỎ
                      </ButtonComponent>
                      <ButtonComponent action="submit">
                        {addTimeTableMutationByExcel.isLoading || searchLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <>
                            <BorderColorIcon className="text-3xl mr-1" />
                            CẬP NHẬT
                          </>
                        )}
                      </ButtonComponent>
                    </div>
                  </form>
                </div>
              </PopupComponent>
            </div>
          </div>
          <div className="text-center mt-10">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <TodayIcon />
              <h4 className="text-xl font-bold uppercase ml-3  max-[639px]:hidden">
                {userRole.includes(HOMEROOM_ROLE) ||
                userRole.includes(PRINCIPAL_ROLE) ||
                userRole.includes(HEADTEACHER_ROLE)
                  ? `THỜI KHÓA BIỂU LỚP ${schoolClass}`
                  : `THỜI KHÓA BIỂU (${currentUser.fullname.toString()})`}
              </h4>
              <h4 className="text-xl font-bold uppercase ml-3 hidden  max-[639px]:block">
                THỜI KHÓA BIỂU
              </h4>
            </div>
          </div>
          <div className="text-center mt-10"></div>
          <div className="flex justify-between mt-2 flex-wrap max-[639px]:mt-4">
            <div className="flex flex-wrap">
              <div className="text-sm mr-4 max-[639px]:mb-4">
                <span className="mr-2 font-bold max-[639px]:mb-4">
                  {userRole.includes(STUDENT_ROLE) ? "Học sinh: " : "Giáo viên: "}
                </span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {currentUser ? currentUser.fullname.toString() : ""}
                </span>
              </div>
              <div className="text-sm max-[639px]:mb-4">
                <span className="mr-2 font-bold">Tiết học:</span>
                <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                  {numberOfSlotInWeek}
                </span>
              </div>
            </div>
            <div className="text-sm">
              <span className="mr-2 font-bold">Năm học:</span>
              <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                {schoolYear}
              </span>
            </div>
          </div>
          {isLoading || searchLoading ? (
            <div className="text-center primary-color my-10 text-xl italic font-medium">
              <div className="mx-auto flex items-center justify-center">
                <p className="mr-3">Loading</p>
                <CircularProgress size={24} color="inherit" />
              </div>
            </div>
          ) : data && currentTimeTable.length > 0 ? (
            <TableWeeklyTimeTableComponent
              data={currentTimeTable}
              onDetails={handleViewSlotDetail}
              onDelete={handleDeleteSlot}
              onEdit={handleEditSlot}
              userRole={userRole}
              className="mt-4"
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
            title="CẬP NHẬT TIẾT HỌC"
            description={`Cập nhập tiết học`}
            icon={<BorderColorIcon />}
            isOpen={openModalUpdate}
            onClose={() => setOpenModalUpdate(false)}
          >
            {isLoadingSubjects || isLoadingTeachers ? (
              <div className="text-center primary-color my-10 text-xl italic font-medium">
                <div className="mx-auto flex items-center justify-center">
                  <p className="mr-3">Loading</p>
                  <CircularProgress size={24} color="inherit" />
                </div>
              </div>
            ) : teachers && subjects ? (
              <form onSubmit={handleSubmitEditAction(handleUpdateSlotAPI)}>
                <InputBaseComponent
                  name="idEdit"
                  label="Mã tiết"
                  className="w-full hidden"
                  control={controlEditAction}
                  setValue={setValue}
                  type="text"
                  options={formattedSlotByDate}
                  errors={errorsEditAction}
                />
                <InputBaseComponent
                  name="subjectIDEdit"
                  label="Môn học"
                  className="w-full"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={formattedSubjects}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Hãy chọn môn học!",
                  }}
                />
                <InputBaseComponent
                  name="teacherIDEdit"
                  label="Giáo viên"
                  className="w-full"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={formattedTeachers}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Hãy chọn giáo viên!",
                  }}
                />
                <div className="w-full flex">
                  <InputBaseComponent
                    name="classIDEdit"
                    label="Lớp học"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    setValue={setValue}
                    type="select"
                    options={formattedClasses}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Hãy chọn lớp học!",
                    }}
                  />

                  <InputBaseComponent
                    name="slotByLessonPlansEdit"
                    label="Tiết theo giáo án"
                    placeholder="Tiết giáo án..."
                    className="w-1/2"
                    control={controlEditAction}
                    setValue={setValue}
                    type="number"
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                </div>
                <div className="flex ">
                  <InputBaseComponent
                    name="dateEdit"
                    label="Ngày học"
                    placeholder="Chọn ngày..."
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    setValue={setValue}
                    type="date"
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    name="slotByDateEdit"
                    label="Tiết học"
                    className="w-1/2"
                    control={controlEditAction}
                    setValue={setValue}
                    type="select"
                    options={formattedSlotByDate}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Hãy chọn tiết học!",
                    }}
                  />
                </div>
                <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi tạo cập nhật!" />
                <div className="mt-5 flex justify-end">
                  <ButtonComponent
                    type="error"
                    action="reset"
                    onClick={() => {
                      setOpenModalUpdate(false);
                      reset();
                    }}
                  >
                    <CancelIcon className="text-3xl mr-1 mb-0.5" />
                    HỦY BỎ
                  </ButtonComponent>
                  <ButtonComponent action="submit">
                    <BorderColorIcon className="text-3xl mr-1" />
                    CẬP NHẬT
                  </ButtonComponent>
                </div>
              </form>
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
          </PopupComponent>

          <PopupComponent
            title="XÓA TIẾT HỌC"
            description="Xóa tiết học khỏi thời khóa biểu"
            icon={<DeleteIcon />}
            isOpen={modalDeleteOpen}
            onClose={() => setModalDeleteOpen(false)}
          >
            <p>Bạn có chắc chắn muốn xóa tiết học?</p>
            <div className="mt-4 flex justify-end">
              <ButtonComponent
                type="error"
                action="button"
                onClick={() => setModalDeleteOpen(false)}
              >
                <CancelIcon className="text-3xl mr-1 mb-0.5" />
                HỦY BỎ
              </ButtonComponent>
              <ButtonComponent action="button" onClick={handleDeleteAPI}>
                <DeleteIcon className="text-3xl mr-1" />
                XÓA
              </ButtonComponent>
            </div>
          </PopupComponent>
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
                <span className="font-bold">(-): </span>
                <span className="italic">
                  Tiết học trống, chưa có tiết học trong thời gian quy định.
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
          {data && currentTimeTable.length > 0 ? (
            <PopupComponent
              title="CHI TIẾT"
              description={`TIẾT: ${currentSlot?.slot}`}
              rightNote={`NGÀY: ${currentSlotDate}`}
              isOpen={openModalDetail}
              onClose={() => setOpenModalDetail(false)}
            >
              <div className="max-w-md max-[639px]:w-full">
                <TextValueComponent
                  label="Tên môn học"
                  value={currentSlot?.subject}
                  icon={<AutoStoriesIcon />}
                  customValue="text-black font-medium"
                />
                <TextValueComponent
                  label="Thời gian"
                  value={currentSlot?.slotTime}
                  icon={<AccessAlarmIcon />}
                  variantValue="success"
                />
                <TextValueComponent
                  label="Phòng"
                  value={currentSlot?.classroom}
                  icon={<LocationOnIcon />}
                />
                <TextValueComponent
                  label="Giáo viên"
                  value={currentSlot?.teacher}
                  icon={<AccountCircleIcon />}
                  variantValue="warning"
                />
                <TextValueComponent
                  label="Bài học"
                  value={currentSlot?.content}
                  icon={<EventAvailableIcon />}
                />
                <TextValueComponent
                  label="Tiết giáo án"
                  value={currentSlot?.slotByLessonPlans}
                  icon={<LockClockIcon />}
                />
                {!userRole.includes(PRINCIPAL_ROLE) ? (
                  <TextValueComponent
                    label="Trạng thái"
                    value={`(${currentSlot?.status})`}
                    icon={<AccessAlarmIcon />}
                    customValue={
                      currentSlot?.status == "Có mặt"
                        ? "success-color font-medium"
                        : currentSlot?.status == "Vắng có phép"
                        ? "warning-color font-medium"
                        : currentSlot?.status == "Vắng không phép"
                        ? "error-color font-medium"
                        : currentSlot?.status == "Chưa bắt đầu"
                        ? "text-color font-medium"
                        : currentSlot?.status == "Vắng"
                        ? "error-color font-medium"
                        : ""
                    }
                  />
                ) : (
                  ""
                )}
                <div className="mt-4 flex justify-end flex-wrap">
                  {currentSlot?.teacher === currentUser?.username ? (
                    <ButtonComponent
                      type="success"
                      action="button"
                      className="mr-2"
                      onClick={() => {
                        navigate(`/takeAttendance/${currentSlot.id}`);
                      }}
                    >
                      <BorderColorIcon className="mr-2" />
                      ĐIỂM DANH
                    </ButtonComponent>
                  ) : (
                    ""
                  )}
                  {!userRole.includes(STUDENT_ROLE) ? (
                    <ButtonComponent
                      action="button"
                      onClick={() => {
                        navigate(`/register-notebook`);
                      }}
                    >
                      <AssignmentIcon className="mr-2" />
                      SỔ ĐẦU BÀI
                    </ButtonComponent>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </PopupComponent>
          ) : (
            ""
          )}
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
