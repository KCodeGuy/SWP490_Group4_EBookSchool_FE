import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { ToastContainer, toast } from "react-toastify";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import CancelIcon from "@mui/icons-material/Cancel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DownloadIcon from "@mui/icons-material/Download";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import {
  getAllClasses,
  addClass,
  updateClass,
  deleteClass,
  downloadTemplateClass,
  addClassByExcel,
  getClassByID,
  downloadTemplateClassByQuery,
} from "../../services/ClassService";
import { getAllTeachers } from "../../services/TeacherService";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import { getAllStudents } from "services/StudentService";
import { isXlsxFile } from "utils/CommonFunctions";
import { PRINCIPAL_ROLE } from "services/APIConfig";
import { useToasts } from "react-toast-notifications";
import { HEADTEACHER_ROLE } from "services/APIConfig";

export default function ClassManagement() {
  const { addToast } = useToasts();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedData, setDeletedData] = useState({});
  const [currentClass, setCurrentClass] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const [addedStudents, setAddedStudents] = useState([]);
  const [currentStudents, setCurrentStudents] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  let accessToken, currentUser, userRole, schoolYearsAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    currentUser = JSON.parse(localStorage.getItem("user"));
  }

  const queryClient = useQueryClient();

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["classState"],
    queryFn: () => getAllClasses(accessToken),
    enabled: false,
  });

  const { data: currentTeacher } = useQuery(["teacherState", { accessToken }], () =>
    getAllTeachers(accessToken)
  );

  const { data: listAllStudents, isLoading: isLoadingStudents } = useQuery(
    ["studentState", { accessToken }],
    () => getAllStudents(accessToken)
  );
  useEffect(() => {
    refetch().then((result) => {
      if (result.data) {
        setCurrentData(result.data);
      }
    });
  }, [data]);

  useEffect(() => {
    if (listAllStudents) {
      setCurrentStudents(listAllStudents);
    }
  }, [listAllStudents]);

  const [schoolYear, setSchoolYear] = useState(schoolYearsAPI[schoolYearsAPI.length - 1]);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const formattedTeachers = currentTeacher?.map((teacher) => ({
    label: `${teacher.fullname}(${teacher.id})`,
    value: teacher.id,
  }));

  const formattedSchoolYears = schoolYearsAPI.map((item) => ({
    label: item,
    value: item,
  }));

  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  //call api add class
  const addClassMutation = useMutation((classData) => addClass(accessToken, classData), {
    onSuccess: (response) => {
      if (response && response?.status === 200) {
        queryClient.invalidateQueries("classState");
        refetch().then((result) => {
          if (result.data) {
            setCurrentData(result.data);
          }
        });
        addToast(`Tạo lớp học thành công!`, {
          appearance: "success",
        });
        reset();
        setAddedStudents([]);
        setModalOpen(false);
      } else {
        addToast(`Tạo lớp thất bại! ${response?.response?.data}!`, {
          appearance: "error",
        });
      }
    },
    onError: (error) => {
      addToast(`Tạo lớp thất bại! ${error?.message}!`, {
        appearance: "error",
      });
    },
  });

  const handleGetItem = (data) => {
    let isDuplicate = false;
    const studentID = data[0];
    const studentFullName = data[1];

    if (addedStudents.length > 0) {
      addedStudents.forEach((item) => {
        if (item.id === studentID) {
          isDuplicate = true;
          addToast(`Học sinh "${studentFullName}" đã tồn tại!`, {
            appearance: "error",
          });
        }
      });
    }
    if (!isDuplicate) {
      const newStudent = { id: studentID, fullname: studentFullName };
      setAddedStudents((prevStudents) => [...prevStudents, newStudent]);
      addToast(`Học sinh "${studentFullName}" đã được thêm thành công!`, {
        appearance: "success",
      });
    }
  };

  const handleAddClass = (data) => {
    let firstSchoolYear = data.schoolYear;
    let firstTeacher = data.teacherID;
    if (!data.schoolYear) {
      firstSchoolYear = formattedSchoolYears[0].value;
    }
    if (!data.teacherID) {
      firstTeacher = formattedTeachers[0]?.value;
    }
    if (addedStudents.length > 0) {
      const studentIds = addedStudents.map((student) => student.id);
      const classData = {
        classroom: data.classroom,
        schoolYear: firstSchoolYear,
        teacherID: firstTeacher,
        students: studentIds,
      };
      try {
        addClassMutation.mutateAsync(classData);
      } catch (error) {
        // Xử lý lỗi nếu cần
      }
    } else {
      addToast(`Bạn chưa thêm học sinh vào danh sách!`, {
        appearance: "error",
      });
    }
  };

  // Xử lí show lên form edit thôi
  const handleEdit = (rowItem) => {
    if (rowItem) {
      const classByID = getClassByID(accessToken, rowItem[1], rowItem[2]);
      setValue("idEdit", rowItem[0]);
      setValue("classroomEdit", rowItem[1]);
      setValue("schoolYearEdit", rowItem[2]);
      setValue("teacherIDEdit", rowItem[4]);
      setModalEditOpen(true);
      classByID.then((result) => {
        setAddedStudents(result?.students);
      });
    } else {
      setModalEditOpen(false);
    }
  };

  // Xử lí show lên form edit thôi
  const handleDetails = (rowItem) => {
    if (rowItem) {
      const classByID = getClassByID(accessToken, rowItem[1], rowItem[2]);
      setValue("idEdit", rowItem[0]);
      setValue("classroomEdit", rowItem[1]);
      setValue("schoolYearEdit", rowItem[2]);
      setValue("teacherIDEdit", rowItem[4]);
      setModalDetailsOpen(true);
      setCurrentClass({
        id: rowItem[0],
        classroom: rowItem[1],
        schoolYear: rowItem[2],
        teacherID: rowItem[4],
      });
      classByID.then((result) => {
        setAddedStudents(result?.students);
      });
    } else {
      setModalDetailsOpen(false);
    }
  };

  const updateClassMutation = useMutation((classData) => updateClass(accessToken, classData), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("classState");
      if (response && response.status == 200) {
        refetch().then((result) => {
          if (result.data) {
            setCurrentData(result.data);
          }
        });
        resetEditAction();
        setModalEditOpen(false);
        addToast(`Cập nhật lớp học thành công!`, {
          appearance: "success",
        });
      } else {
        addToast(`Cập nhật lớp thất bại! ${response?.response?.data}!`, {
          appearance: "error",
        });
      }
    },
    onError: (error) => {
      addToast(`Cập nhật lớp thất bại! ${error.message}!`, {
        appearance: "error",
      });
    },
  });

  // Xử lí get dữ liệu khi submit
  const handleUpdateClass = (data) => {
    if (addedStudents.length > 0) {
      const studentIds = addedStudents.map((student) => student.id);
      const classData = {
        id: data.idEdit,
        classroom: data.classroomEdit,
        schoolYear: data.schoolYearEdit,
        teacherID: data.teacherIDEdit,
        students: studentIds,
      };
      updateClassMutation.mutate(classData);
    } else {
      addToast("Bạn chưa thêm học sinh vào danh sách!", {
        appearance: "error",
      });
    }
  };

  const handleStatistic = () => {
    setCurrentData(filterByButton(schoolYear, data));
  };

  const deleteClassMutation = useMutation((classId) => deleteClass(accessToken, classId), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("classState");
      if (response && response.status == 200) {
        refetch().then((result) => {
          if (result.data) {
            setCurrentData(result.data);
          }
        });
        addToast("Xóa lớp học thành công!", {
          appearance: "success",
        });
      } else {
        addToast("Xóa lớp học thất bại!", {
          appearance: "error",
        });
      }
      setModalDeleteOpen(false);
    },
    onError: (error) => {
      addToast(`Xóa lớp thất bại. ${error.message}!`, {
        appearance: "error",
      });
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeletedData({
        id: rowItem[0],
      });
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteClassMutation.mutate(deletedData.id);
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterStudentClasses(txtSearch, data));
  };

  const filterByButton = (action, data) => {
    if (data) {
      return data.filter((item) => {
        return item.schoolYear.toLowerCase() === action.toLowerCase();
      });
    }
  };

  const filterStudentClasses = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    if (data) {
      return data.filter((classroom) => {
        return (
          classroom.teacher.toLowerCase().includes(search) ||
          classroom.schoolYear.toLowerCase().includes(search) ||
          classroom.classroom.toLowerCase().includes(search)
        );
      });
    }
  };

  const filterStudentsForAdding = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    if (data) {
      return data.filter((student) => {
        return (
          student.id.toLowerCase().includes(search) ||
          student.username.toLowerCase().includes(search) ||
          student.fullname.toLowerCase().includes(search)
        );
      });
    }
  };

  const addClassByExcelMutation = useMutation((file) => addClassByExcel(accessToken, file), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("addSubjectExcel");
      if (response && response?.status === 200) {
        refetch().then((result) => {
          if (result.data) {
            setCurrentData(data);
          }
        });
        addToast("Tạo lớp học thành công!", {
          appearance: "success",
        });
        reset();
        setModalOpen(false);
      } else {
        addToast(`Tạo lớp thất bại! ${response?.response?.data}!`, {
          appearance: "error",
        });
      }
    },
    onError: (error) => {
      addToast(`Tạo lớp thất bại. ${error.message}!`, {
        appearance: "error",
      });
    },
  });
  const handleAddSubjectByExcel = (data) => {
    if (data) {
      if (isXlsxFile(data?.classFile)) {
        addClassByExcelMutation.mutate(data.classFile);
      } else {
        addToast(`Tạo lớp thất bại! File không đúng định dạng ".xlsx"!`, {
          appearance: "error",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <MeetingRoomIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ LỚP HỌC</h4>
            </div>
          </div>
          <div className="mt-4 grid max-[693px]:grid-cols-1 md:grid-cols-2 gap-1 max-[693px]:mt-6">
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
                  {schoolYearsAPI?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:w-full max-[639px]:ml-0 mt-3 ml-2 sm:mt-0">
                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleStatistic}
                >
                  <FilterAltIcon className="" /> TÌM KIẾM
                </ButtonComponent>
              </div>
            </div>
            <div className="w-full flex justify-end max-[639px]:justify-between items-center mt-3 sm:mt-0 ">
              <SearchInputComponent
                className=""
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                {userRole.includes(PRINCIPAL_ROLE) || userRole.includes(HEADTEACHER_ROLE) ? (
                  <ButtonComponent className="" onClick={() => setModalOpen(true)}>
                    <AddCircleOutlineIcon className="mr-1" focusable="false" />
                    TẠO
                  </ButtonComponent>
                ) : (
                  ""
                )}
                <PopupComponent
                  title="TẠO LỚP HỌC"
                  description="Hãy tạo lớp học để bắt đầu năm học mới"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  tabs={[{ label: "TẠO LỚP" }, { label: "TẠO BẰNG EXCEL" }]}
                  currentTab={currentTab}
                  onTabChange={(newValue) => {
                    reset();
                    setCurrentTab(newValue);
                  }}
                >
                  <div role="tabpanel" hidden={currentTab !== 0}>
                    <form onSubmit={handleSubmit(handleAddClass)}>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập tên lớp học..."
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="classroom"
                          className="w-1/3 mr-2"
                          label="Tên lớp"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            minLength: {
                              value: 4,
                              message: "tên lớp ít nhât 4 kí tự!",
                            },
                            maxLength: {
                              value: 10,
                              message: "Tên lớp nhiều nhất 10 kí tự!",
                            },
                          }}
                        />
                        <InputBaseComponent
                          label="Năm học"
                          name="schoolYear"
                          className="w-1/3 mr-2"
                          control={control}
                          setValue={noSetValue}
                          type="select"
                          options={formattedSchoolYears}
                          errors={errors}
                        />
                        <InputBaseComponent
                          label="GV chủ nhiệm"
                          name="teacherID"
                          className="w-1/3"
                          control={control}
                          setValue={noSetValue}
                          type="select"
                          options={formattedTeachers}
                          errors={errors}
                        />
                      </div>
                      <label className="mr-2 font-medium">
                        Danh sách học sinh ({addedStudents?.length}){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="outline-none px-3 py-2 border border-blue-500 rounded flex flex-wrap mb-2">
                        {addedStudents?.length > 0 ? (
                          addedStudents?.map((item, index) => (
                            <p
                              key={index}
                              value={item.id}
                              className="text-sm px-1 bg-primary-color mr-2 max-w-max italic text-white rounded-md mb-2"
                            >
                              {item.fullname}
                              <span
                                className="text-lg cursor-pointer"
                                onClick={() => {
                                  setAddedStudents(
                                    addedStudents.filter((student) => student.id != item.id)
                                  );
                                  addToast(`Xóa học sinh "${item.fullname}" thành công!`, {
                                    appearance: "success",
                                  });
                                }}
                              >
                                <CancelIcon className="mb-0.5 ml-1" />
                              </span>
                            </p>
                          ))
                        ) : (
                          <span className="text-base font-medium">Chưa có học sinh!</span>
                        )}
                      </div>
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi tạo!" />
                      <div className="mt-4 flex justify-end sm:min-w-fit-table max-[639px]:mb-3">
                        <ButtonComponent
                          className=""
                          type="error"
                          action="reset"
                          onClick={() => {
                            reset();
                            setAddedStudents([]);
                          }}
                        >
                          <CleaningServicesIcon className="text-3xl mr-1 mb-1" />
                          ĐẶT LẠI
                        </ButtonComponent>
                        <ButtonComponent action="submit">
                          <AddCircleOutlineIcon className="text-3xl mr-1" focusable="false" />
                          TẠO
                        </ButtonComponent>
                      </div>
                    </form>
                    <SearchInputComponent
                      className="-translate-y-11 max-[639px]:translate-y-0"
                      onSearch={(txtSearch) => {
                        setCurrentStudents(filterStudentsForAdding(txtSearch, listAllStudents));
                        reset();
                      }}
                      placeHolder="Nhập từ khóa..."
                    />
                    <div className="flex justify-between max-[639px]:my-3">
                      <p className="text-sm font-bold -translate-y-9 max-[639px]:translate-y-0">
                        TẤT CẢ HỌC SINH ({currentStudents?.length})
                      </p>
                      <p className="text-sm font-bold -translate-y-9 max-[639px]:hidden">
                        Hãy thêm học sinh để tạo lớp.
                      </p>
                    </div>

                    {isLoadingStudents ? (
                      <div className="text-center primary-color my-10 text-xl italic font-medium">
                        <div className="mx-auto flex items-center justify-center">
                          <p className="mr-3">Loading</p>
                          <CircularProgress size={24} color="inherit" />
                        </div>
                      </div>
                    ) : currentStudents?.length > 0 ? (
                      <TableComponent
                        header={["Mã HS", "Họ và tên", "Ảnh"]}
                        data={currentStudents?.map((item) => [item.id, item.fullname, item.avatar])}
                        onGet={handleGetItem}
                        className="-translate-y-7 max-[639px]:translate-y-0"
                        isOrdered={true}
                        itemsPerPage={5}
                        isImage={2}
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
                  </div>
                  <div role="tabpane2" hidden={currentTab == 1}>
                    <ButtonComponent action="submit" onClick={downloadTemplateClass}>
                      <DownloadIcon className="mr-2" />
                      TẢI XUỐNG
                    </ButtonComponent>
                    <form onSubmit={handleSubmit(handleAddSubjectByExcel)}>
                      <InputBaseComponent
                        name="classFile"
                        label="Lớp học(Excel)"
                        className="w-full mt-5"
                        control={control}
                        setValue={noSetValue}
                        type="file"
                        errors={errors}
                        validationRules={{
                          required: "Hãy chọn file!",
                        }}
                      />
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi tạo!" />
                      <div className="mt-5 flex justify-end">
                        <ButtonComponent
                          type="error"
                          action="reset"
                          onClick={() => {
                            reset();
                            setModalOpen(false);
                          }}
                        >
                          <CancelIcon className="text-3xl mr-1 mb-0.5" />
                          HỦY BỎ
                        </ButtonComponent>
                        <ButtonComponent action="submit">
                          {addClassByExcelMutation.isLoading ? (
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
              </div>
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
              userRole.includes(PRINCIPAL_ROLE) || userRole.includes(HEADTEACHER_ROLE) ? (
                <TableComponent
                  header={["Tên lớp", "Năm học", "Phòng học", "Giáo viên chủ nhiệm"]}
                  data={currentData?.map((item) => [
                    item.id,
                    item.classroom,
                    item.schoolYear,
                    `Phòng ${item.classroom}`,
                    item.teacher,
                  ])}
                  itemsPerPage={20}
                  onEdit={handleEdit}
                  onDetails={handleDetails}
                  hiddenColumns={[0]}
                  onDelete={handleDelete}
                  className="mt-8"
                />
              ) : (
                <TableComponent
                  header={["Tên lớp", "Năm học", "Phòng học", "Giáo viên chủ nhiệm"]}
                  data={currentData?.map((item) => [
                    item.id,
                    item.classroom,
                    item.schoolYear,
                    `Phòng ${item.classroom}`,
                    item.teacher,
                  ])}
                  itemsPerPage={20}
                  onDetails={handleDetails}
                  hiddenColumns={[0]}
                  className="mt-8"
                />
              )
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
              title="CẬP NHẬT"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={() => {
                setAddedStudents([]);
                setModalEditOpen(false);
              }}
            >
              <form onSubmit={handleSubmitEditAction(handleUpdateClass)}>
                <div className="flex">
                  <InputBaseComponent
                    type="text"
                    control={controlEditAction}
                    className="hidden"
                    name="idEdit"
                    label="Tên lớp"
                    setValue={setValue}
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    placeholder="Nhập tên lớp học"
                    type="text"
                    control={controlEditAction}
                    className="w-1/2 mr-2"
                    name="classroomEdit"
                    label="Tên lớp"
                    setValue={setValue}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    label="Năm học"
                    name="schoolYearEdit"
                    className="w-1/2"
                    control={controlEditAction}
                    type="select"
                    options={formattedSchoolYears}
                    setValue={setValue}
                    errors={errorsEditAction}
                  />
                </div>
                <InputBaseComponent
                  label="Giáo viên chủ nhiệm"
                  name="teacherIDEdit"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={formattedTeachers}
                  errors={errorsEditAction}
                />{" "}
                <label className="mr-2 font-medium">
                  Danh sách học sinh ({addedStudents?.length}){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="outline-none px-3 py-2 border border-blue-500 rounded flex flex-wrap mb-2">
                  {addedStudents?.length > 0 ? (
                    addedStudents?.map((item, index) => (
                      <p
                        key={index}
                        value={item.id}
                        className="text-sm px-1 bg-primary-color mr-2 max-w-max italic text-white rounded-md mb-2"
                      >
                        {item.fullname}
                        <span
                          className="text-lg cursor-pointer"
                          onClick={() => {
                            setAddedStudents(
                              addedStudents.filter((student) => student.id != item.id)
                            );
                            addToast(`Xóa học sinh "${item.fullname}" thành công!`, {
                              appearance: "success",
                            });
                          }}
                        >
                          <CancelIcon className="mb-0.5 ml-1" />
                        </span>
                      </p>
                    ))
                  ) : (
                    <span className="text-base font-medium">Chưa có học sinh!</span>
                  )}
                </div>
                <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi cập nhật!" />
                <div className="mt-4 flex justify-end sm:min-w-fit-table max-[639px]:mb-3">
                  <ButtonComponent
                    type="error"
                    action="reset"
                    onClick={() => {
                      setModalEditOpen(false);
                      resetEditAction();
                    }}
                  >
                    <CancelIcon className="text-3xl mr-1 mb-0.5" />
                    HỦY BỎ
                  </ButtonComponent>
                  <ButtonComponent action="submit">
                    <BorderColorIcon className="text-3xl mr-1  mb-0.5" />
                    CẬP NHẬT
                  </ButtonComponent>
                </div>
              </form>
              <SearchInputComponent
                className="-translate-y-11 max-[639px]:translate-y-0 "
                onSearch={(txt) => {
                  setCurrentStudents(filterStudentsForAdding(txt, listAllStudents));
                  resetEditAction();
                }}
                placeHolder="Nhập từ khóa..."
              />
              <div className="flex justify-between max-[639px]:my-3">
                <p className="text-sm font-bold -translate-y-9  max-[639px]:translate-y-0">
                  TẤT CẢ HỌC SINH ({currentStudents?.length})
                </p>
                <p className="text-sm font-bold -translate-y-9 max-[639px]:hidden">
                  Hãy thêm học sinh để tạo lớp.
                </p>
              </div>

              {isLoadingStudents ? (
                <div className="text-center primary-color my-10 text-xl italic font-medium">
                  <div className="mx-auto flex items-center justify-center">
                    <p className="mr-3">Loading</p>
                    <CircularProgress size={24} color="inherit" />
                  </div>
                </div>
              ) : currentStudents?.length > 0 ? (
                <TableComponent
                  header={["Mã HS", "Họ và tên", "Ảnh"]}
                  data={currentStudents?.map((item) => [item.id, item.fullname, item.avatar])}
                  onGet={handleGetItem}
                  className="-translate-y-7 max-[639px]:translate-y-0"
                  isOrdered={true}
                  itemsPerPage={5}
                  isImage={2}
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
            </PopupComponent>
            <PopupComponent
              title="CHI TIẾT"
              description="Thông tin chi tiết lớp học"
              icon={<EditIcon />}
              isOpen={modalDetailsOpen}
              onClose={() => {
                setAddedStudents([]);
                setModalDetailsOpen(false);
              }}
            >
              <form onSubmit={handleSubmitEditAction(handleUpdateClass)}>
                <div className="flex">
                  <InputBaseComponent
                    disabled
                    type="text"
                    control={controlEditAction}
                    className="hidden"
                    name="idEdit"
                    label="Tên lớp"
                    setValue={setValue}
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    disabled
                    placeholder="Nhập tên lớp học"
                    type="text"
                    control={controlEditAction}
                    className="w-1/2 mr-2"
                    name="classroomEdit"
                    label="Tên lớp"
                    setValue={setValue}
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    disabled
                    label="Năm học"
                    name="schoolYearEdit"
                    className="w-1/2"
                    control={controlEditAction}
                    type="text"
                    options={formattedSchoolYears}
                    setValue={setValue}
                    errors={errorsEditAction}
                  />
                </div>
                <InputBaseComponent
                  disabled
                  label="Giáo viên chủ nhiệm"
                  name="teacherIDEdit"
                  control={controlEditAction}
                  setValue={setValue}
                  type="text"
                  options={formattedTeachers}
                  errors={errorsEditAction}
                />
              </form>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-bold">
                  Danh sách học sinh {`(${addedStudents?.length})`}
                </p>
                <ButtonComponent
                  className=""
                  action="button"
                  onClick={() => {
                    downloadTemplateClassByQuery(currentClass?.classroom, currentClass?.schoolYear);
                  }}
                >
                  <DownloadIcon className="mr-2" />
                  TẢI XUỐNG
                </ButtonComponent>
              </div>

              {isLoadingStudents ? (
                <div className="text-center primary-color my-10 text-xl italic font-medium">
                  <div className="mx-auto flex items-center justify-center">
                    <p className="mr-3">Loading</p>
                    <CircularProgress size={24} color="inherit" />
                  </div>
                </div>
              ) : addedStudents?.length > 0 ? (
                <TableComponent
                  header={["Mã HS", "Họ và tên", "Ảnh"]}
                  data={addedStudents?.map((item) => [item.id, item.fullname, item.avatar])}
                  className="mt-4"
                  isOrdered={true}
                  itemsPerPage={50}
                  isImage={2}
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
            </PopupComponent>
            <PopupComponent
              title="XÓA LỚP HỌC"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => setModalDeleteOpen(false)}
            >
              <p>Bạn có chắc chắn muốn xóa lớp học?</p>
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
                  <DeleteIcon className="text-3xl mr-1 mb-0.5" />
                  XÓA
                </ButtonComponent>
              </div>
            </PopupComponent>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
