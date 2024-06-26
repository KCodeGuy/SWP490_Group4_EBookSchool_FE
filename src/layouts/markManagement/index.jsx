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
import AssignmentIcon from "@mui/icons-material/Assignment";
import LockClockIcon from "@mui/icons-material/LockClock";

import React, { useState, useEffect, useRef } from "react";
import TableMarkOfSubjectComponent from "../../components/TableMarkOfSubjectComponent/TableMarkOfSubjectComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import { useForm } from "react-hook-form";
import { generateClasses } from "utils/CommonFunctions";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllSubjects } from "services/SubjectService";
import {
  downloadTemplateMarkByMarkComponent,
  getMarkOfAllStudentsBySubject,
  getMarkOfClassAllSubjects,
  updateMarkByMarkComponent,
} from "../../services/markService";
import TableMarkAllStudentsComponent from "../../components/TableMarkAllStudentsComponent/TableMarkAllStudentsComponent";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import TextValueComponent from "../../components/TextValueComponent";
import { renderRankingStyles } from "utils/RenderStyle";
import { renderRanking } from "utils/RenderStyle";

// Mark management (HieuTTN)
const semesters = [
  { label: "Học kỳ I", value: "Học kỳ I" },
  { label: "Học kỳ II", value: "Học kỳ II" },
  { label: "Cả năm", value: "Cả năm" },
];

const indexCols = [
  { label: "Lần 1", value: 1 },
  { label: "Lần 2", value: 2 },
  { label: "Lần 3", value: 3 },
  { label: "Lần 4", value: 4 },
  { label: "Lần 5", value: 5 },
];

const nameScore = [
  { label: "Kiểm tra miệng", value: "Miệng" },
  { label: "Kiểm tra 15 phút", value: "15p" },
  { label: "Kiểm tra 1 tiết", value: "1 Tiết" },
  { label: "Kiểm tra học kì", value: "Cuối kỳ" },
];
export default function MarkManagement() {
  const [currentOfStudentsMarkBySubject, setCurrentOfStudentsMarkBySubject] = useState([]);
  const [currentMarkOfClass, setCurrentMarkOfClass] = useState([]);
  const [currentAction, setCurrentAction] = useState("adding");
  const [currentTab, setCurrentTab] = useState(0);
  const [currentTabDetails, setCurrentTabDetails] = useState(0);
  const [openModalRandom, setOpenModalRandom] = useState(false);
  const [openModalDetails, setOpenModalDetails] = useState(false);
  const [currentStudents, setCurrentStudents] = useState([]);
  const [markDetails, setMarkDetails] = useState({});
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

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
    if (rowItem) {
      setMarkDetails(rowItem);
      setOpenModalDetails(true);
    }
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

  const {
    data: markOfClassAllSubject,
    isError: isErrorMarkOfClass,
    isLoading: isLoadingMarkOfClass,
    refetch: refetchMarkOfClass,
  } = useQuery({
    queryKey: ["markOfClassAllSubject", { accessToken, schoolYear, schoolClass }],
    queryFn: () => getMarkOfClassAllSubjects(accessToken, schoolYear, schoolClass),
    enabled: false,
  });

  const handleFilterMark = () => {
    refetch().then((result) => {
      if (result.data?.success) {
        setCurrentOfStudentsMarkBySubject(result.data?.data?.score);
      }
    });

    refetchMarkOfClass().then((result) => {
      if (result.data?.success) {
        setCurrentMarkOfClass(result.data?.data?.averages);
      }
    });
  };

  const formattedSubjects = data?.data
    ?.map((item) => ({
      label: `${item.name} (Khối-${item.grade})`,
      name: item.name,
      value: item.name,
      grade: item.grade,
    }))
    ?.sort((a, b) => a.grade - b.grade);

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
    if (!data.indexCol) {
      data.indexCol = 1;
    }
    const params = {
      className: data.className,
      schoolYear: data.schoolYear,
      semester: data.semester,
      subjectName: data.subjectName,
      component: data.component,
      indexCol: data.indexCol,
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
    if (data) {
      updateMarkMutation.mutate(data.markFile);
    }
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

              {userRole === "Principal" || userRole === "SubjectTeacher" ? (
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
                    {formattedSubjects?.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                ""
              )}

              <ButtonComponent type="success" onClick={handleFilterMark}>
                <FilterAltIcon className="mr-1" /> TÌM KIẾM
              </ButtonComponent>
            </div>
            {userRole === "SubjectTeacher" ? (
              <>
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
                    <BorderColorIcon className="text-3xl mr-1" />
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
                  tabs={[{ label: "TẢI XUỐNG" }, { label: "TẢI LÊN" }]}
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
                      <InputBaseComponent
                        name="indexCol"
                        label="Lần thứ"
                        className="w-full"
                        control={control}
                        setValue={noSetValue}
                        type="select"
                        options={indexCols}
                        errors={errors}
                      />
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi tải xuống!" />
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
                          TẢI XUỐNG
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
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi tải lên!" />
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
              </>
            ) : (
              ""
            )}
          </div>

          <PopupComponent
            title="RANDOM HỌC SINH"
            description="Chọn ngẫu nhiên học sinh"
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

          <PopupComponent
            title="CHI TIẾT ĐIỂM"
            description="Chi tiết các cột điểm trong kỳ"
            rightNote={`HS: ${markDetails?.fullName}`}
            isOpen={openModalDetails}
            onClose={() => setOpenModalDetails(false)}
          >
            {nameScore?.map((markComponent, index) => (
              <div key={index}>
                <div className="flex justify-between bg-primary-color text-white rounded-sm italic px-2 text-sm py-1 mb-1">
                  <span>
                    <AssignmentIcon className="mb-0.5" /> {markComponent.label}
                  </span>
                  <span>{schoolSemester}</span>
                </div>
                {markDetails && markDetails?.scores && markDetails?.scores.length > 0 ? (
                  markDetails?.scores.map((item, index) =>
                    item.key == markComponent.value && item.semester == schoolSemester ? (
                      <TextValueComponent
                        label={`Lần ${item.indexCol}`}
                        key={index}
                        className="px-4 justify-between justify-between"
                        value={`${item.value != -1 ? `${item.value} điểm` : "_"}`}
                        icon={<LockClockIcon />}
                      />
                    ) : (
                      ""
                    )
                  )
                ) : (
                  <span className="italic text-base">Chưa có điểm</span>
                )}
              </div>
            ))}
            <div className="flex justify-between text-base mt-3 border-t-2 pt-2">
              <div>
                <span className="font-bold">Xếp loại: </span>
                {markDetails?.average != -1 && markDetails?.average != 0 ? (
                  <span className={renderRankingStyles(markDetails?.average)}>
                    {renderRanking(markDetails?.average)}
                  </span>
                ) : (
                  <span className="text-base italic">Chưa xếp loại</span>
                )}
              </div>
              <div>
                <span className="font-bold">TBM: </span>
                {markDetails?.average != -1 && markDetails?.average != 0 ? (
                  <span className="mx-auto text-center text-white px-3 py-1 rounded bg-success-color">
                    {markDetails ? markDetails?.average : "_"}
                  </span>
                ) : (
                  <span className="text-base italic">Chưa có điểm</span>
                )}
              </div>
            </div>
          </PopupComponent>

          <>
            {userRole === "HomeroomTeacher" || userRole === "Principal" ? (
              <>
                <div className="text-center mt-10 uppercase">
                  <h4 className="text-xl font-bold">Bảng điểm tổng kết lớp {schoolClass}</h4>
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
                      Random
                    </ButtonComponent>
                  </div>
                </div>
                {isLoadingMarkOfClass ? (
                  <div className="text-center primary-color my-10 text-xl italic font-medium">
                    <div className="mx-auto flex items-center justify-center">
                      <p className="mr-3">Loading</p>
                      <CircularProgress size={24} color="inherit" />
                    </div>
                  </div>
                ) : markOfClassAllSubject?.success && currentMarkOfClass.length > 0 ? (
                  <TableMarkAllStudentsComponent
                    className="mt-4"
                    semester={schoolSemester}
                    itemsPerPage={30}
                    data={currentMarkOfClass}
                    onViewDetails={handleDetails}
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
            ) : (
              ""
            )}

            <>
              {userRole === "SubjectTeacher" || userRole === "Principal" ? (
                <>
                  <div className="text-center mt-10 uppercase">
                    <h4 className="text-xl font-bold">
                      Bảng điểm môn {schoolSubject} lớp {schoolClass}
                    </h4>
                    <h4 className="text-xl font-bold">
                      Học kỳ: {schoolSemester}. Năm học: {schoolYear}
                    </h4>
                  </div>

                  {isLoadingMark ? (
                    <div className="text-center primary-color my-10 text-xl italic font-medium">
                      <div className="mx-auto flex items-center justify-center">
                        <p className="mr-3">Loading</p>
                        <CircularProgress size={24} color="inherit" />
                      </div>
                    </div>
                  ) : markOfStudentsBySubject?.success &&
                    currentOfStudentsMarkBySubject.length > 0 ? (
                    <TableMarkOfSubjectComponent
                      semester={schoolSemester}
                      isHideMark={openModalRandom}
                      data={currentOfStudentsMarkBySubject}
                      className="mt-4 text-left"
                      onDetails={handleDetails}
                      itemsPerPage={30}
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
              ) : (
                ""
              )}

              <div className="mt-5 text-base">
                <p className="font-bold">Ghi chú:</p>
                <ul className="list-disc ml-5">
                  <li>
                    <span className="font-bold">(-): </span>
                    <span className="italic">
                      Chưa có điểm, giáo viên chưa nhập điểm cho cột này.
                    </span>
                  </li>
                  <li>
                    <span className="black font-medium italic">(Chưa xếp loại): </span>
                    <span className="italic">Học sinh đạt điểm trung bình học kỳ loại giỏi.</span>
                  </li>
                  <li>
                    <span className="success-color font-medium italic">(Giỏi): </span>
                    <span className="italic">Học sinh đạt điểm trung bình học kỳ loại giỏi.</span>
                  </li>
                  <li>
                    <span className="primary-color font-medium italic">(Khá): </span>
                    <span className="italic">Học sinh đạt điểm trung bình học kỳ loại khá.</span>
                  </li>
                  <li>
                    <span className="warning-color font-medium italic">(Trung bình): </span>
                    <span className="italic">
                      Học sinh đạt điểm trung bình học kỳ loại trung bình.
                    </span>
                  </li>
                  <li>
                    <span className="error-color font-medium italic">(Kém): </span>
                    <span className="italic">Học sinh đạt điểm trung bình học kỳ loại kém.</span>
                  </li>
                </ul>
              </div>
            </>
          </>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
