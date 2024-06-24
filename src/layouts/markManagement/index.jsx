import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { FormControl, InputLabel, Card, MenuItem, Select, CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from "react-toastify";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import React, { useState, useEffect, useRef } from "react";
import TableMarkOfSubjectComponent from "../../components/TableMarkOfSubjectComponent/TableMarkOfSubjectComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PopupComponent from "components/PopupComponent/PopupComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm } from "react-hook-form";
import { generateClasses } from "utils/CommonFunctions";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllSubjects } from "services/SubjectService";
import {
  downloadTemplateMarkByMarkComponent,
  getMarkOfAllStudentsBySubject,
  updateMarkByMarkComponent,
} from "../../services/markService";
import TableMarkAllStudentsComponent from "components/TableMarkAllStudentsComponent/TableMarkAllStudentsComponent";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";

// Mark management (HieuTTN)
const semesters = [
  { label: "Học kỳ I", value: "Học kỳ I" },
  { label: "Học kỳ II", value: "Học kỳ II" },
];

const nameScore = [
  { label: "Kiểm tra miệng", value: "Miệng" },
  { label: "Kiểm tra 15 phút", value: "15p" },
  { label: "Kiểm tra 1 tiết", value: "1 Tiết" },
  { label: "Kiểm tra học kì", value: "Cuối kỳ" },
];
export default function MarkManagement() {
  const [currentOfStudentsMarkBySubject, setCurrentOfStudentsMarkBySubject] = useState([]);
  const [currentAction, setCurrentAction] = useState("adding");
  const [currentTab, setCurrentTab] = useState(0);
  const [openModalRandom, setOpenModalRandom] = useState(false);
  const [currentStudents, setCurrentStudents] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const handleImportMark = () => {};
  const queryClient = useQueryClient();

  let accessToken, currentUser, userRole, userID, schoolYearsAPI, classesAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    classesAPI = JSON.parse(localStorage.getItem("currentClasses"));
    currentUser = JSON.parse(localStorage.getItem("user"));
    userID = currentUser.id;
  }

  //call api get all
  const { data, error, isLoading } = useQuery(["subjectState", { accessToken }], () =>
    getAllSubjects(accessToken)
  );

  //1. Modal form states open, close
  const [modalAdd, setModalAdd] = useState(false);

  const [schoolYear, setSchoolYear] = React.useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const classesOfSchoolYear = generateClasses(classesAPI, schoolYear);
  const [schoolClass, setSchoolClass] = React.useState(classesOfSchoolYear[0]?.Classroom);
  const handleChangeClass = (event) => {
    setSchoolClass(event.target.value);
  };

  useEffect(() => {
    if (data?.data?.length > 0) {
      setSchoolSubject(data.data[0].name); // Set the default value to the first item
    }
  }, [data]);
  const [schoolSubject, setSchoolSubject] = React.useState("");
  const handleSchoolSubjectSelectedChange = (event) => {
    setSchoolSubject(event.target.value);
  };

  const [schoolSemester, setSchoolSemester] = React.useState(semesters[0].label);
  const handleSemesterChange = (event) => {
    setSchoolSemester(event.target.value);
  };

  const handleDetails = (rowItem) => {
    console.log("Details row:", rowItem);
  };

  const formattedClasses = classesOfSchoolYear.map((item) => ({
    label: item.Classroom,
    value: item.Classroom,
  }));

  const {
    data: markOfStudentsBySubject,
    isError: isErrorMark,
    isLoading: isLoadingMark,
    refetch,
  } = useQuery({
    queryKey: ["markOfStudentBySubject", { accessToken, schoolYear, schoolClass, schoolSubject }],
    queryFn: () =>
      getMarkOfAllStudentsBySubject(accessToken, schoolYear, schoolClass, schoolSubject),
    enabled: false,
  });

  const handleFilterMark = () => {
    refetch().then((result) => {
      if (result.data?.success) {
        setCurrentOfStudentsMarkBySubject(result.data?.data?.score);
      }
    });
  };

  const formattedSubjects = data?.data?.map((item) => ({
    label: `${item.name} (Khối-${item.grade})`,
    value: item.name,
  }));

  const formattedSchoolYear = schoolYearsAPI?.map((item) => ({
    label: item,
    value: item,
  }));

  const handleDownloadTemplate = (data) => {
    if (!data.className) {
      data.className = classesOfSchoolYear[0].Classroom;
    }
    if (!data.schoolYear) {
      data.schoolYear = formattedSchoolYear[formattedSchoolYear.length - 1].label;
    }
    if (!data.semester) {
      data.semester = semesters[0].value;
    }
    if (!data.subjectName) {
      data.subjectName = formattedSubjects[0].value;
    }
    if (!data.component) {
      data.component = nameScore[0].value;
    }
    const params = {
      className: data.className,
      schoolYear: data.schoolYear,
      semester: data.semester,
      subjectName: data.subjectName,
      component: data.component,
    };
    if (params) {
      downloadTemplateMarkByMarkComponent(params);
    }
  };

  const updateMarkMutation = useMutation((file) => updateMarkByMarkComponent(accessToken, file), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("timeTableState");
      if (response && response.success) {
        toast.success("Nhập điểm thành công!");
      } else {
        toast.error(`${response.data}!`);
      }
      reset();
      setModalAdd(false);
      refetch().then((result) => {
        if (result.data?.success) {
          setCurrentOfStudentsMarkBySubject(result.data?.data?.score);
        }
      });
    },
  });
  const handleUploadTemplate = (data) => {
    console.log("Updload file", data);
    updateMarkMutation.mutate(data.markFile);
  };
  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <div className="flex flex-nowrap justify-between mb-2.5">
            <div className="left">
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
                    <MenuItem key={index} value={item.Classroom}>
                      {item.Classroom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-subject-lable">Môn học</InputLabel>
                <Select
                  labelId="select-school-subject-lable"
                  id="select-school-subject"
                  value={schoolSubject}
                  className="h-10 mr-2 max-[767px]:mb-4"
                  label="Môn học"
                  onChange={handleSchoolSubjectSelectedChange}
                >
                  {data?.data?.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      {item.name} - (Khối {item.grade})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <ButtonComponent type="success" onClick={handleFilterMark}>
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
            </div>
            <div>
              <ButtonComponent
                className=""
                onClick={() => {
                  setCurrentAction("adding");
                  setModalAdd(true);
                }}
              >
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                NHẬP ĐIỂM
              </ButtonComponent>
              <ButtonComponent
                type="success"
                onClick={() => {
                  setCurrentAction("updating");
                  setModalAdd(true);
                }}
              >
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                CẬP NHẬT
              </ButtonComponent>
            </div>
            <PopupComponent
              title={currentAction == "adding" ? "NHẬP ĐIỂM" : "CẬP NHẬT"}
              description={
                currentAction == "adding" ? "Nhập điểm bằng Excel" : "Cập nhật điểm bằng Excel"
              }
              icon={<AddCircleOutlineIcon />}
              isOpen={modalAdd}
              onClose={() => setModalAdd(false)}
              tabs={[{ label: "TẢI FILE" }, { label: "UPLOAD FILE" }]}
              currentTab={currentTab}
              onTabChange={(event, newValue) => {
                setCurrentTab(newValue);
              }}
            >
              <div role="tabpanel" hidden={currentTab !== 0}>
                <form onSubmit={handleSubmit(handleDownloadTemplate)}>
                  <div className="flex">
                    <InputBaseComponent
                      name="schoolYear"
                      label="Năm học"
                      className="w-1/2 mr-2"
                      control={control}
                      setValue={noSetValue}
                      type="select"
                      options={formattedSchoolYear}
                      errors={errors}
                    />
                    <InputBaseComponent
                      name="className"
                      label="Lớp học"
                      className="w-1/2"
                      control={control}
                      setValue={noSetValue}
                      type="select"
                      options={formattedClasses}
                      errors={errors}
                    />
                  </div>
                  <div className="flex">
                    <InputBaseComponent
                      name="component"
                      label="Điểm thành phần"
                      className="w-1/2 mr-2"
                      control={control}
                      setValue={noSetValue}
                      type="select"
                      options={nameScore}
                      errors={errors}
                    />
                    <InputBaseComponent
                      name="semester"
                      label="Học kì"
                      className="w-1/2"
                      control={control}
                      setValue={noSetValue}
                      type="select"
                      options={semesters}
                      errors={errors}
                    />
                  </div>
                  <InputBaseComponent
                    name="subjectName"
                    label="Môn học"
                    className="w-full"
                    control={control}
                    setValue={noSetValue}
                    type="select"
                    options={formattedSubjects}
                    errors={errors}
                  />
                  <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi tải!" />
                  <div className="mt-5 flex justify-end">
                    <ButtonComponent
                      type="error"
                      action="reset"
                      onClick={() => {
                        reset();
                        setModalAdd(false);
                      }}
                    >
                      <CancelIcon className="text-3xl mr-1 mb-0.5" />
                      HỦY BỎ
                    </ButtonComponent>
                    <ButtonComponent action="submit">
                      <DownloadIcon className="mr-2" />
                      TẢI FILE
                    </ButtonComponent>
                  </div>
                </form>
              </div>
              <div role="tabpanel" hidden={currentTab == 1}>
                <form onSubmit={handleSubmit(handleUploadTemplate)}>
                  <InputBaseComponent
                    name="markFile"
                    label="File điểm(Excel)"
                    className="w-full mt-2"
                    control={control}
                    setValue={noSetValue}
                    type="file"
                    errors={errors}
                    validationRules={{
                      required: "Hãy chọn file!",
                    }}
                  />
                  <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi upload!" />
                  <div className="mt-5 flex justify-end">
                    <ButtonComponent
                      type="error"
                      action="reset"
                      onClick={() => {
                        reset();
                        setModalAdd(false);
                      }}
                    >
                      <CancelIcon className="text-3xl mr-1 mb-0.5" />
                      HỦY BỎ
                    </ButtonComponent>
                    <ButtonComponent action="submit">
                      {currentAction == "adding" ? (
                        <AddCircleOutlineIcon className="text-3xl mr-1" />
                      ) : (
                        <BorderColorIcon className="text-3xl mr-1" />
                      )}
                      {currentAction == "adding" ? "NHẬP ĐIỂM" : "CẬP NHẬT"}
                    </ButtonComponent>
                  </div>
                </form>
              </div>
            </PopupComponent>
          </div>

          <PopupComponent
            title="RANDOM HỌC SINH"
            description="RANDOM HỌC SINH"
            isOpen={openModalRandom}
            onClose={() => setOpenModalRandom(false)}
          >
            <div className="mt-4 flex justify-end">
              <ButtonComponent
                type="error"
                action="button"
                onClick={() => setOpenModalRandom(false)}
              >
                HỦY BỎ
              </ButtonComponent>
              <ButtonComponent action="button">RANDOM</ButtonComponent>
            </div>
          </PopupComponent>

          <>
            {/* <div className="text-center mt-5">
              <h4 className="text-xl font-bold">Bảng điểm tổng kết lớp 12A1</h4>
              <h4 className="text-xl font-bold">Học kỳ: HKI. Năm học: 2023-2024</h4>
            </div>
            <TableMarkAllStudentsComponent
              className="mt-4"
              itemsPerPage={10}
              data={scoreByStudents.data}
              onViewDetails={handleViewDetails}
            /> */}
            <>
              <div className="text-center mt-5">
                <h4 className="text-xl font-bold">
                  Bảng điểm môn {schoolSubject} lớp {schoolClass}
                </h4>
                <h4 className="text-xl font-bold">
                  Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                </h4>
              </div>
              <div className="flex flex-nowrap justify-between icon-custom">
                <div className="text-sm mr-4 flex">
                  <div className="mr-2">
                    <span className="mr-2 font-bold">Giáo viên: </span>
                    <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                      {currentUser ? currentUser.fullname.toString() : "Chưa có thông tin!"}
                    </span>
                  </div>
                  {/* <div>
                    <span className="mr-2 font-bold">Môn học: </span>
                    <span className="text-center text-white px-3 py-2 leading-8 rounded bg-primary-color">
                      {schoolSubject ? schoolSubject.toString() : "Chưa có thông tin!"}
                    </span>
                  </div> */}
                </div>
                <div className="flex">
                  <div className="flex items-center">
                    <span className="mr-2 font-bold text-sm">Chọn học kỳ: </span>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel id="select-school-semester-lable">Học kỳ</InputLabel>
                      <Select
                        labelId="select-school-semester-lable"
                        id="select-school-semester"
                        value={schoolSemester}
                        className="h-10 mr-2 max-[767px]:mb-4"
                        label="Học kỳ"
                        onChange={handleSemesterChange}
                      >
                        {semesters.map((item, index) => (
                          <MenuItem key={index} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <ButtonComponent
                    onClick={() => {
                      setOpenModalRandom(true);
                    }}
                  >
                    <CardGiftcardIcon className="mr-2" />
                    Random học sinh
                  </ButtonComponent>
                </div>
              </div>

              {isLoadingMark ? (
                <div className="text-center primary-color my-10 text-xl italic font-medium">
                  <div className="mx-auto flex items-center justify-center">
                    <p className="mr-3">Loading</p>
                    <CircularProgress size={24} color="inherit" />
                  </div>
                </div>
              ) : markOfStudentsBySubject?.success && currentOfStudentsMarkBySubject.length > 0 ? (
                <TableMarkOfSubjectComponent
                  semester={schoolSemester}
                  isHideMark={openModalRandom}
                  data={currentOfStudentsMarkBySubject}
                  className="mt-4 text-left"
                  onDetails={handleDetails}
                  itemsPerPage={20}
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
            </>
          </>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
