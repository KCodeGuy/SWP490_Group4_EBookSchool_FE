import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";

import "./style.scss";
import { grades } from "../../mock/grade";
import { subjects, subject } from "../../mock/subject";
import { studentClasses } from "../../mock/class";
import { schoolYears } from "../../mock/schoolYear";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import { accounts } from "mock/account";
import { getAllTeachers } from "services/TeacherService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { deleteTeacher } from "services/TeacherService";
import { getTeacherByID } from "services/TeacherService";
import { createTeacher } from "services/TeacherService";

const accessToken = localStorage.getItem("authToken");

// Account management (UolLT)
export default function AccountManagement() {
  //1. Modal form states open, close
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedSubject, setDeletedSubject] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const currentSubjects = subjects.data;

  const markFactors = subject.data.points[0].componentPoints.map((obj) => [
    obj.id,
    obj.name,
    obj.count,
    obj.scoreFactor,
    subject.data.points[0].semeaster,
  ]);

  const lessonPlan = subject.data.lessonPlans.map((obj) => [
    obj.id,
    obj.title,
    obj.description,
    obj.slot,
  ]);

  //2. Set data by Call API
  const radioOptions = [
    { label: "Đảng viên", value: "Đảng viên" },
    { label: "Đoàn viên", value: "Đoàn viên" },
  ];

  const roles = ["Giáo viên chủ nhiệm", "Học sinh/Phụ huynh", "Giáo viên bộ môn", "Giám thị"];
  const semesters = ["Học kì I", "Học kì II", "Cả năm"];

  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const formattedSchoolYears = schoolYears.data.map((year) => ({
    label: year.schoolYear,
    value: year.schoolYear,
  }));

  const formattedGrades = grades.data.map((grade) => ({
    label: grade.name,
    value: grade.name,
  }));

  const [accounts, setAccounts] = useState();
  const [username, setUsername] = useState();
  const [teacherID, setTeacherID] = useState();
  const [avatar, setAvatar] = useState(null);

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(["getTeachers", { accessToken }], () =>
    getAllTeachers(accessToken)
  );
  useEffect(() => {
    if (data?.success) {
      setAccounts(data?.data);
    }
  }, [data]);

  //3.1 React-hook-from of adding action
  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  //3.1 React-hook-from of editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  //4. Functions handle adding
  const handleOpenAddModal = () => {
    setModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setModalOpen(false);
  };

  const handleAddAccount = (data) => {
    console.log("Call API add subject: ", data);
    // Call API add subject here
  };

  const handleAddInfomation = (data) => {
    console.log("Call API add mark: ", data);
    // Call API add subject here
  };

  // Add nè
  const addTeacherMutation = useMutation((data) => createTeacher(accessToken, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("addTeacher");
      if (response && response.success) {
        toast.success("Tạo giáo viên thành công!");
      } else {
        toast.error(`${response.data}!`);
      }
      reset();
      setModalOpen(false);
    },
  });

  const handleAddRole = (data) => {
    const permissionKeys = Object.keys(data).filter((key) => key.startsWith("is") && data[key]);
    const roleKeys = Object.keys(data).filter((key) => key.startsWith("role") && data[key]);

    const permissions = permissionKeys.map((key) => {
      return key
        .replace("is", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
    });

    const roles = roleKeys.map((key) => {
      return key
        .replace("role", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
    });

    const otherValues = Object.keys(data)
      .filter((key) => !key.startsWith("is") && !key.startsWith("role"))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    const newObj = {
      permissions,
      roles,
      otherValues,
    };

    console.log("New Object:", newObj);
    addTeacherMutation.mutate(newObj);
  };

  const handleClearAddForm = () => {
    reset(); // Reset the form of adding modal
  };

  //5. Functions handle editing
  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  };

  const handleEdit = (rowItem) => {
    console.dir(rowItem);
    if (rowItem) {
      setTeacherID(rowItem[0]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };
  const handleEditSubject = (data) => {
    console.log("Call API edit subject: ", data);
    // Call API edit subject here
  };
  const handleClearEditForm = () => {
    resetEditAction();
  };

  const {
    data: teacherData,
    error: teacherError,
    isLoading: teacherLoading,
  } = useQuery(
    ["teacherState", { accessToken, teacherID }],
    () => getTeacherByID(accessToken, teacherID),
    {
      enabled: !!teacherID, // Only run the query if teacherID is defined
    }
  );

  useEffect(() => {
    if (teacherData?.data) {
      console.dir(teacherData.data);
      setValue("id", teacherData.data.id);
      setValue("fullName", teacherData.data.fullname);
      setValue("birthday", teacherData.data.birthday.split("T")[0]);
      setValue("gender", teacherData.data.gender);
      setValue("nation", teacherData.data.nation);
      setValue("email", teacherData.data.email);
      setValue("phone", teacherData.data.phone);
      setValue("isBachelor", teacherData.data.isBachelor);
      setValue("isMaster", teacherData.data.isMaster);
      setValue("isDoctor", teacherData.data.isDoctor);
      setValue("isProfessor", teacherData.data.isProfessor);
      setValue("address", teacherData.data.address);
      setValue("avatar", teacherData.data.avatar);
      setAvatar(teacherData.data.avatar);
    }
  }, [teacherData, setValue]);

  useEffect(() => {
    queryClient.invalidateQueries(["teacherState", { accessToken, teacherID }]);
  }, [teacherID]);

  //6. Functions handle deleting
  const handleCloseDeleteModal = () => {
    setModalDeleteOpen(false);
  };

  const handleStatistic = () => {
    console.log("Call api: ", { schoolYear });
  };

  useEffect(() => {
    if (data?.success) {
      setAccounts(data?.data);
    }
  }, [data]);

  const deleteTeacherMutation = useMutation((username) => deleteTeacher(accessToken, username), {
    onSuccess: (response) => {
      if (response && response.success) {
        toast.success("Xóa giáo viên thành công!");
        queryClient.invalidateQueries(["getTeachers", { accessToken }]); // Invalidate the getTeachers query
      } else {
        toast.error("Xóa giáo viên thất bại!");
      }
      setModalDeleteOpen(false);
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setUsername(rowItem[1]);
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteTeacherMutation.mutate(username);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const handleChangeSearchValue = (txtSearch) => {
    console.log(txtSearch);
    setCurrentData(filterSubjects(txtSearch, studentClasses.data));
  };

  const filterSubjects = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((subject) => {
      return (
        (subject.title && subject.title.toLowerCase().includes(search)) ||
        (subject.description && subject.description.toLowerCase().includes(search))
      );
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">QUẢN LÍ TÀI KHOẢN</h4>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            {/* role Select */}
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120, marginRight: "12px" }}>
                <InputLabel id="select-role-label" className="ml-3">
                  Chức vụ
                </InputLabel>
                <Select
                  labelId="select-role-label"
                  id="select-role"
                  value={selectedRole}
                  className="h-10 mx-3"
                  label="Chức vụ"
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:mt-2">
                <ButtonComponent type="success" onClick={handleStatistic}>
                  <FilterAltIcon className="mr-1" /> Tìm kiếm
                </ButtonComponent>
              </div>
            </div>
            <div className="flex justify-end items-center sm:w-full sm:flex-wrap ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                <ButtonComponent className="" onClick={handleOpenAddModal}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  Tạo TKGV
                </ButtonComponent>
                <ButtonComponent className="" onClick={handleOpenAddModal}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  Tạo TKHS
                </ButtonComponent>
                <PopupComponent
                  title="TẠO TÀI KHOẢN"
                  description="Hãy tạo tài khoản"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={handleCloseAddModal}
                  tabs={[
                    { label: "TẠO TÀI KHOẢN" },
                    { label: "THÊM THÔNG TIN" },
                    { label: "VAI TRÒ" },
                    { label: "PHÂN QUYỀN" },
                    { label: "TẠO BẰNG EXCEL" },
                  ]}
                  currentTab={currentTab}
                  onTabChange={handleTabChange}
                >
                  {/* Content for Tab 1 */}
                  <div role="tabpanel" hidden={currentTab !== 0}>
                    <form onSubmit={handleSubmit(handleAddAccount)}>
                      <InputBaseComponent
                        placeholder="Nhập tên tài khoản"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="username"
                        label="Tên tài khoản"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        placeholder="Nhập mật khẩu"
                        // className="w-1/2 mr-3"
                        type="password"
                        control={control}
                        setValue={noSetValue}
                        name="password"
                        label="Mật khẩu"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                          minLength: {
                            value: 6,
                            message: "Mật khẩu ít nhất 8 kí tự!",
                          },
                          maxLength: {
                            value: 20,
                            message: "Mật khẩu dài nhất 20 kí tự!",
                          },
                        }}
                      />
                      {/* <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập mật khẩu"
                          // className="w-1/2 mr-3"
                          type="password"
                          control={control}
                          setValue={noSetValue}
                          name="password"
                          label="Mật khẩu"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            minLength: {
                              value: 6,
                              message: "Mật khẩu ít nhất 8 kí tự!",
                            },
                            maxLength: {
                              value: 20,
                              message: "Mật khẩu dài nhất 20 kí tự!",
                            },
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập lại mật khẩu"
                          className="w-1/2"
                          type="password"
                          control={control}
                          setValue={noSetValue}
                          name="passwordConfirm"
                          label="Xác nhận mật khẩu"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            minLength: {
                              value: 6,
                              message: "Mật khẩu ít nhất 8 kí tự!",
                            },
                            maxLength: {
                              value: 20,
                              message: "Mật khẩu dài nhất 20 kí tự!",
                            },
                          }}
                        />
                      </div> */}
                    </form>
                  </div>
                  {/* Content for Tab 2 */}
                  <div role="tabpanel" hidden={currentTab == 1}>
                    {/* Form để nhập thêm thông tin */}
                    <form onSubmit={handleSubmit(handleAddInfomation)}>
                      {/* Left column */}
                      <div className="w-full flex">
                        <InputBaseComponent
                          placeholder="Nhập họ và tên"
                          className="w/1/3 mr-3"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="fullName"
                          label="Họ & Tên"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />

                        <InputBaseComponent
                          placeholder="Nhập email"
                          className="w/1/3 mr-3"
                          type="email"
                          control={control}
                          setValue={noSetValue}
                          name="email"
                          label="Email"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Email không đúng định dạng!",
                            },
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập số điện thoại"
                          className="w/1/3"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="phone"
                          label="Số điện thoại"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Số điện thoại không đúng định dạng!",
                            },
                          }}
                        />
                      </div>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập mã số căn cước"
                          className="w/1/3 mr-3"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="address"
                          label="Địa chỉ"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập ngày sinh"
                          className="w/1/3 mr-3"
                          type="date"
                          control={control}
                          setValue={noSetValue}
                          name="birthday"
                          label="Ngày sinh"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>

                      <InputBaseComponent
                        placeholder="Nhập gới tính"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="gender"
                        label="Giới tính"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                        className="mt-4"
                      />

                      <InputBaseComponent
                        placeholder="Nhập dân tộc"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="nation"
                        label="Dân tộc"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                        className="mt-4"
                      />

                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="bachelor"
                        label="Cử nhân"
                        errors={errors}
                      />

                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="master"
                        label="Thạc sĩ"
                        errors={errors}
                      />

                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="doctor"
                        label="Tiến sĩ"
                        errors={errors}
                      />

                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="professor"
                        label="Giáo sư"
                        errors={errors}
                      />

                      <InputBaseComponent
                        type="file"
                        className="w-full"
                        control={control}
                        setValue={noSetValue}
                        name="avatar"
                        label="Ảnh đại diện"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </form>
                  </div>
                  {/* Content for Tab 3 */}
                  <div role="tabpanel" hidden={currentTab == 2}>
                    {/* phân quyền*/}
                    <form onSubmit={handleSubmit(handleAddRole)}>
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleAmin"
                        label="Hiệu trưởng/Hiệu phó"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleSupervisor"
                        label="Tổng phụ trách"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleHomeroomTeacher"
                        label="Giáo viên chủ nhiệm"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleSubjectTeacher"
                        label="Giáo viên bộ môn"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleStudent"
                        label="Học sinh"
                        errors={errors}
                      />
                    </form>
                  </div>
                  <div role="tabpanel" hidden={currentTab == 3}>
                    {/* phân quyền*/}
                    <form onSubmit={handleSubmit(handleAddRole)}>
                      <div className="flex w-full flex-wrap">
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetTeacher"
                            label="Xem giáo viên"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddTeacher"
                            label="Thêm giáo viên"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateTeacher"
                            label="Chỉnh sửa giáo viên"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteTeacher"
                            label="Xóa giáo viên"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetStudent"
                            label="Xem học sinh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddStudent"
                            label="Thêm học sinh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateStudent"
                            label="Chỉnh sửa học sinh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteStudent"
                            label="Xóa học sinh"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetSubject"
                            label="Xem môn học"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddSubject"
                            label="Thêm môn học"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateSubject"
                            label="Chỉnh sửa môn học"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteSubject"
                            label="Xóa môn học"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetClass"
                            label="Xem lớp"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddClass"
                            label="Thêm lớp"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateClass"
                            label="Chỉnh sửa lớp"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteClass"
                            label="Xóa lớp"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetSchedule"
                            label="Xem thời khóa biểu"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddSchedule"
                            label="Thêm thời khóa biểu"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateSchedule"
                            label="Chỉnh sửa thời khóa biểu"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteSchedule"
                            label="Xóa thời khóa biểu"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetRegisterBook"
                            label="Xem sổ đầu bài"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddRegisterBook"
                            label="Thêm sổ đầu bài"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateRegisterBook"
                            label="Chỉnh sửa sổ đầu bài"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteRegisterBook"
                            label="Xóa sổ đầu bài"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetAttendance"
                            label="Xem điểm danh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddAttendance"
                            label="Thêm điểm danh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateAttendance"
                            label="Chỉnh sửa điểm danh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteAttendance"
                            label="Xóa điểm danh"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetMark"
                            label="Xem điểm"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddMark"
                            label="Thêm điểm"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateMark"
                            label="Chỉnh sửa điểm"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteMark"
                            label="Xóa điểm"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetNotification"
                            label="Xem thông báo"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddNotification"
                            label="Thêm thông báo"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateNotification"
                            label="Chỉnh sửa thông báo"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteNotification"
                            label="Xóa thông báo"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                          {/* Left in right column */}
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateSetting"
                            label="Cài đặt"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetLog"
                            label="Xem lịch sử hoạt động"
                            errors={errors}
                          />
                        </div>
                      </div>
                      <div className="mt-5 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">XÁC NHẬN</ButtonComponent>
                      </div>
                    </form>
                  </div>
                  <div role="tabpanel" hidden={currentTab == 4}>
                    <ButtonComponent action="submit">
                      <DownloadIcon className="mr-2" />
                      TẢI FILE
                    </ButtonComponent>
                    <form onSubmit={handleSubmit(handleAddAccount)}>
                      <InputBaseComponent
                        name="timeTableFile"
                        label="Tài khoản(Excel)"
                        className="w-full mt-5"
                        control={control}
                        setValue={noSetValue}
                        type="file"
                        errors={errors}
                        validationRules={{
                          required: "Hãy chọn file!",
                        }}
                      />
                      <div className="mt-5 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">TẠO</ButtonComponent>
                      </div>
                    </form>
                  </div>
                </PopupComponent>
              </div>
            </div>
          </div>
          <div>
            {/* show data table */}
            {accounts != null && accounts.length > 0 ? (
              <TableComponent
                header={["Mã giáo viên", "Tên đăng nhập", "Tên đầy đủ", "Email", "Số điện thoại"]}
                data={accounts.map((item) => [
                  item.id,
                  item.username,
                  item.fullname,
                  item.email,
                  item.phone,
                ])}
                itemsPerPage={10}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="mt-8"
              />
            ) : null}
            <PopupComponent
              title="CẬP NHẬT"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={handleCloseEditModal}
            >
              <form onSubmit={handleSubmitEditAction(handleEditSubject)}>
                <InputBaseComponent
                  placeholder="Nhập tên môn học"
                  type="text"
                  control={controlEditAction}
                  name="nameEdit"
                  label="Tên môn học"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <div className="flex">
                  <InputBaseComponent
                    label="Năm học"
                    name="selectYearEdit"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    type="select"
                    options={formattedSchoolYears}
                    setValue={noSetValue}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Hãy chọn năm học!",
                    }}
                  />
                  <InputBaseComponent
                    label="Khối"
                    name="selectGradeEdit"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    setValue={noSetValue}
                    type="select"
                    options={formattedGrades}
                    errors={errors}
                    validationRules={{
                      required: "Hãy chọn khối!",
                    }}
                  />
                </div>
                <InputBaseComponent
                  placeholder="Nhập mô tả"
                  type="text"
                  control={controlEditAction}
                  name="descriptionEdit"
                  label="Nhập mô tả"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <ButtonComponent type="error" action="reset" onClick={handleClearEditForm}>
                    CLEAR
                  </ButtonComponent>
                  <ButtonComponent action="submit">CHỈNH SỬA</ButtonComponent>
                </div>
              </form>
            </PopupComponent>
            <PopupComponent
              title="XÓA TÀI KHOẢN"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={handleCloseDeleteModal}
            >
              <p>Bạn có chắc chắn muốn xóa tài khoản?</p>
              <div className="mt-4 flex justify-end">
                <ButtonComponent type="error" action="button" onClick={handleCloseDeleteModal}>
                  HỦY BỎ
                </ButtonComponent>
                <ButtonComponent action="button" onClick={handleDeleteAPI}>
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
