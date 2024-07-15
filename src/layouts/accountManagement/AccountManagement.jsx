import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import CancelIcon from "@mui/icons-material/Cancel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DownloadIcon from "@mui/icons-material/Download";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import { getAllTeachers } from "services/TeacherService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { deleteTeacher } from "services/TeacherService";
import { getTeacherByID } from "services/TeacherService";
import { createTeacher } from "services/TeacherService";
import { updateTeacher } from "services/TeacherService";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";

const sortOptions = [
  { label: "Chưa xài được", value: { index: 0, option: "ASC" } },
  { label: "Mã giáo viên(A-Z)", value: { index: 1, option: "ASC" } },
  { label: "Mã giáo viên(Z-A)", value: { index: 1, option: "DESC" } },
  { label: "Tên đăng nhập(A-Z)", value: { index: 2, option: "ASC" } },
  { label: "Tên đăng nhập(Z-A)", value: { index: 2, option: "DESC" } },
  { label: "Họ và tên(A-Z)", value: { index: 3, option: "ASC" } },
  { label: "Họ và tên(Z-A)", value: { index: 3, option: "DESC" } },
];

// Account management (UolLT)
export default function AccountManagement() {
  const accessToken = localStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentTabEdit, setCurrentTabEdit] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState();
  const [teacherID, setTeacherID] = useState();
  const [avatar, setAvatar] = useState(null);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(["teacherAccounts", { accessToken }], () =>
    getAllTeachers(accessToken)
  );
  useEffect(() => {
    if (data) {
      setAccounts(data);
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
    watch: watch,
    formState: { errors: errorsEditAction },
  } = useForm();

  const handleAddAccount = (data) => {
    // console.log("Call API add subject: ", data);
    // Call API add subject here
  };

  const handleAddInfomation = (data) => {
    // console.log("Call API add mark: ", data);
    // Call API add subject here
  };

  const addTeacherMutation = useMutation((data) => createTeacher(accessToken, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("teacherAccounts");
      if (response) {
        toast.success("Tạo giáo viên thành công!");
      } else {
        toast.error(`${response}!`);
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

    addTeacherMutation.mutate(newObj);
  };

  const handleEdit = (rowItem) => {
    if (rowItem) {
      setTeacherID(rowItem[0]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };

  const updateTeacherMutation = useMutation(
    (teacherData) => updateTeacher(accessToken, teacherData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("teacherAccounts");
        if (response && response) {
          toast.success("Cập nhật giáo viên thành công!");
        } else {
          toast.error(`${response}!`);
        }
        resetEditAction();
        setModalEditOpen(false);
      },
      onError: (error) => {
        console.error("Error updating teacher:", error);
        toast.error("Cập nhật giáo viên thất bại!");
      },
    }
  );

  const handleEditSubject = (data) => {
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
      id: teacherID,
      permissions,
      roles,
      otherValues,
    };

    updateTeacherMutation.mutate(newObj);
  };

  const {
    data: teacherData,
    error: teacherError,
    isLoading: teacherLoading,
  } = useQuery(
    ["teacherState", { accessToken, teacherID }],
    () => getTeacherByID(accessToken, teacherID),
    {
      enabled: !!teacherID,
    }
  );

  useEffect(() => {
    if (teacherData) {
      setValue("id", teacherData?.id);
      setValue("fullName", teacherData?.fullname);
      if (teacherData?.birthday) {
        setValue("birthday", teacherData?.birthday.split("T")[0]);
      }
      setValue("gender", teacherData?.gender);
      setValue("nation", teacherData?.nation);
      setValue("email", teacherData?.email);
      setValue("phone", teacherData?.phone);
      setValue("isBachelor", teacherData?.isBachelor);
      setValue("isMaster", teacherData?.isMaster);
      setValue("isDoctor", teacherData?.isDoctor);
      setValue("isProfessor", teacherData?.isProfessor);
      setValue("address", teacherData?.address);
      setValue("avatar", teacherData?.avatar);
      setAvatar(teacherData?.avatar);

      teacherData?.roles.forEach((role) => {
        const formattedRole = `role${role}`;
        setValue(formattedRole, true);
      });

      // Handling permissions
      teacherData?.permissions.forEach((permission) => {
        const formattedPermission = `is${permission.replace(/\s+/g, "")}`;
        setValue(formattedPermission, true);
      });
    }
  }, [teacherData, setValue]);

  const formValues = watch();

  useEffect(() => {
    queryClient.invalidateQueries(["teacherState", { accessToken, teacherID }]);
  }, [teacherID]);

  useEffect(() => {
    if (data) {
      setAccounts(data);
    }
  }, [data]);

  const deleteTeacherMutation = useMutation((username) => deleteTeacher(accessToken, username), {
    onSuccess: (response) => {
      if (response) {
        queryClient.invalidateQueries(["teacherAccounts", { accessToken }]); // Invalidate the getTeachers query
        toast.success(`Xóa giáo viên "${username}" thành công!`);
      } else {
        toast.error("Xóa giáo viên thất bại!");
      }
      setModalDeleteOpen(false);
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setUsername(rowItem[0]);
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteTeacherMutation.mutate(username);
  };

  const handleChangeSearchValue = (txtSearch) => {
    setAccounts(searchTeacher(txtSearch, data));
  };

  const searchTeacher = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((item) => {
      return (
        (item.id && item.id.toLowerCase().includes(search)) ||
        (item.fullname && item.fullname.toLowerCase().includes(search)) ||
        (item.username && item.username.toLowerCase().includes(search)) ||
        (item.email && item.email.toLowerCase().includes(search)) ||
        (item.phone && item.phone.toLowerCase().includes(search))
      );
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleTabEditChange = (event, newValue) => {
    setCurrentTabEdits(newValue);
  };
  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <GroupIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ GIÁO VIÊN</h4>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable">Sắp xếp theo</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="select-school-year"
                  value={sortOption}
                  className="h-11 mr-0"
                  label="Sắp xếp theo"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  {sortOptions.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:mt-2 ml-3">
                <ButtonComponent type="success" onClick={() => {}}>
                  <SwapVertIcon className="text-3xl mr-1" /> SẮP XẾP
                </ButtonComponent>
              </div>
            </div>
            <div className="flex justify-end items-center sm:w-full sm:flex-wrap ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                <ButtonComponent className="" onClick={() => setModalOpen(true)}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  TẠO
                </ButtonComponent>
                <PopupComponent
                  title="TẠO TÀI KHOẢN"
                  description="Hãy tạo tài khoản"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  tabs={[
                    { label: "1. TÀI KHOẢN" },
                    { label: "2. CHI TIẾT" },
                    { label: "3. VAI TRÒ" },
                    { label: "4. PHÂN QUYỀN" },
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
                            message: "Mật khẩu ít nhất 6 kí tự!",
                          },
                          maxLength: {
                            value: 20,
                            message: "Mật khẩu dài nhất 20 kí tự!",
                          },
                        }}
                      />
                      <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                    </form>
                  </div>
                  {/* Content for Tab 2 */}
                  <div role="tabpanel" hidden={currentTab == 1}>
                    <form onSubmit={handleSubmit(handleAddInfomation)}>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nguyen Van A"
                          className="w-1/2 mr-2"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="fullName"
                          label="Họ và tên"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập ngày sinh"
                          className="w-1/2 mr-2"
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
                        <InputBaseComponent
                          placeholder="Nam"
                          className="w-1/2"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="gender"
                          label="Giới tính"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>

                      <div className="w-full flex">
                        <InputBaseComponent
                          placeholder="Kinh"
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="nation"
                          label="Dân tộc"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          placeholder="gv@gmail.com"
                          className="w-1/2 mr-2"
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
                          placeholder="0234123470"
                          className="w-1/2"
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
                          type="checkbox"
                          className="mr-3"
                          horizontalLabel={true}
                          control={control}
                          setValue={noSetValue}
                          name="bachelor"
                          label="Cử nhân"
                          errors={errors}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          className="mr-3"
                          horizontalLabel={true}
                          control={control}
                          setValue={noSetValue}
                          name="master"
                          label="Thạc sĩ"
                          errors={errors}
                        />

                        <InputBaseComponent
                          type="checkbox"
                          className="mr-3"
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
                      </div>

                      <InputBaseComponent
                        placeholder="600 Nguyen van cu"
                        className="w-full"
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
                    <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
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
                    <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                  </div>
                  <div role="tabpanel" hidden={currentTab == 3}>
                    {/* phân quyền*/}
                    <form onSubmit={handleSubmit(handleAddRole)}>
                      <div className="flex w-full">
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5 mr-3">
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
                      </div>
                      <div className="w-full flex">
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5 mr-3">
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
                      </div>
                      <div className="w-full flex">
                        <div className="w-1/2 border-2 order-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
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
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5 mr-3">
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
                      </div>
                      <div className="w-full flex">
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5 mr-3">
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
                      </div>
                      <div className="w-full flex">
                        <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5 mr-3">
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
                      <NotifyCheckInfoForm
                        className="mt-2"
                        actionText="Hãy kiểm tra kĩ thông tin trước khi tạo!"
                      />
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
                          <AddCircleOutlineIcon className="text-3xl mr-1" />
                          TẠO
                        </ButtonComponent>
                      </div>
                    </form>
                  </div>
                  <div role="tabpanel" hidden={currentTab == 4}>
                    <ButtonComponent action="submit">
                      <DownloadIcon className="mr-2" />
                      TẢI XUỐNG
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
                          <AddCircleOutlineIcon className="text-3xl mr-1" />
                          TẠO
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
            ) : data && accounts.length > 0 ? (
              <TableComponent
                header={[
                  "Mã giáo viên",
                  "Họ và tên",
                  "Hình ảnh",
                  "Tên đăng nhập",
                  "Email",
                  "Số điện thoại",
                ]}
                data={accounts.map((item) => [
                  item.id,
                  item.fullname,
                  item.avatar,
                  item.username,
                  item.email,
                  item.phone,
                ])}
                itemsPerPage={30}
                isImage={2}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
            {/* show data table */}
            {/* {accounts != null && accounts.length > 0 ? (
              <TableComponent
                header={["Mã giáo viên", "Tên đăng nhập", "Họ và tên", "Email", "Số điện thoại"]}
                data={accounts.map((item) => [
                  item.id,
                  item.username,
                  item.fullname,
                  item.email,
                  item.phone,
                ])}
                itemsPerPage={30}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="mt-8"
              />
            ) : null} */}
            <PopupComponent
              title="CẬP NHẬT"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={() => setModalEditOpen(false)}
              tabs={[{ label: "THÊM THÔNG TIN" }, { label: "VAI TRÒ" }, { label: "PHÂN QUYỀN" }]}
              currentTab={currentTabEdit}
              onTabChange={handleTabEditChange}
            >
              {/* Content for Tab 2 */}
              <div role="tabpanel" hidden={currentTabEdit !== 0}>
                {/* Form để nhập thêm thông tin */}
                <form onSubmit={handleSubmit(handleAddInfomation)}>
                  {/* Left column */}
                  <div className="w-full flex">
                    <InputBaseComponent
                      placeholder="Nhập họ và tên"
                      className="w/1/3 mr-3"
                      type="text"
                      control={controlEditAction}
                      setValue={setValue}
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
                      control={controlEditAction}
                      setValue={setValue}
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
                      control={controlEditAction}
                      setValue={setValue}
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
                      control={controlEditAction}
                      setValue={setValue}
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
                      control={controlEditAction}
                      setValue={setValue}
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
                    control={controlEditAction}
                    setValue={setValue}
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
                    control={controlEditAction}
                    setValue={setValue}
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
                    control={controlEditAction}
                    setValue={setValue}
                    name="bachelor"
                    label="Cử nhân"
                    errors={errors}
                  />

                  <InputBaseComponent
                    type="checkbox"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="master"
                    label="Thạc sĩ"
                    errors={errors}
                  />

                  <InputBaseComponent
                    type="checkbox"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="doctor"
                    label="Tiến sĩ"
                    errors={errors}
                  />

                  <InputBaseComponent
                    type="checkbox"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="professor"
                    label="Giáo sư"
                    errors={errors}
                  />

                  <div className="flex">
                    <InputBaseComponent
                      type="file"
                      className="w-full"
                      control={controlEditAction}
                      setValue={setValue}
                      name="avatar"
                      label="Ảnh đại diện"
                      errors={errors}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    {avatar && (
                      <img
                        className="w-24 ml-2 h-24 rounded-md object-cover object-center"
                        src={avatar}
                        alt="avatar"
                      />
                    )}
                  </div>
                </form>
              </div>
              {/* Content for Tab 3 */}
              <div role="tabpanel" hidden={currentTabEdit == 1}>
                {/* phân quyền*/}
                <form onSubmit={handleSubmit(handleAddRole)}>
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleAmin"
                    label="Hiệu trưởng/Hiệu phó"
                    errors={errors}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleSupervisor"
                    label="Tổng phụ trách"
                    errors={errors}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleHomeroomTeacher"
                    label="Giáo viên chủ nhiệm"
                    errors={errors}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleSubjectTeacher"
                    label="Giáo viên bộ môn"
                    errors={errors}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleStudent"
                    label="Học sinh"
                    errors={errors}
                  />
                </form>
              </div>
              <div role="tabpanel" hidden={currentTabEdit == 2}>
                {/* phân quyền*/}
                <form onSubmit={handleSubmitEditAction(handleEditSubject)}>
                  <div className="flex w-full">
                    <div className="w-1/2 border-2 border-gray-300 rounded-xl justify-center p-5 mt-5">
                      {/* Left in right column */}
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetTeacher"
                        label="Xem giáo viên"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddTeacher"
                        label="Thêm giáo viên"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateTeacher"
                        label="Chỉnh sửa giáo viên"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetStudent"
                        label="Xem học sinh"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddStudent"
                        label="Thêm học sinh"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateStudent"
                        label="Chỉnh sửa học sinh"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetSubject"
                        label="Xem môn học"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddSubject"
                        label="Thêm môn học"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateSubject"
                        label="Chỉnh sửa môn học"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetClass"
                        label="Xem lớp"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddClass"
                        label="Thêm lớp"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateClass"
                        label="Chỉnh sửa lớp"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetSchedule"
                        label="Xem thời khóa biểu"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddSchedule"
                        label="Thêm thời khóa biểu"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateSchedule"
                        label="Chỉnh sửa thời khóa biểu"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetRegisterBook"
                        label="Xem sổ đầu bài"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddRegisterBook"
                        label="Thêm sổ đầu bài"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateRegisterBook"
                        label="Chỉnh sửa sổ đầu bài"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetAttendance"
                        label="Xem điểm danh"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddAttendance"
                        label="Thêm điểm danh"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateAttendance"
                        label="Chỉnh sửa điểm danh"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetMark"
                        label="Xem điểm"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddMark"
                        label="Thêm điểm"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateMark"
                        label="Chỉnh sửa điểm"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetNotification"
                        label="Xem thông báo"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isAddNotification"
                        label="Thêm thông báo"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateNotification"
                        label="Chỉnh sửa thông báo"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
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
                        control={controlEditAction}
                        setValue={setValue}
                        name="isUpdateSetting"
                        label="Cài đặt"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isGetLog"
                        label="Xem lịch sử hoạt động"
                        errors={errors}
                      />
                    </div>
                  </div>
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
                      <BorderColorIcon className="text-3xl mr-1" />
                      CẬP NHẬT
                    </ButtonComponent>
                  </div>
                </form>
              </div>
            </PopupComponent>
            <PopupComponent
              title="XÓA TÀI KHOẢN"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => setModalDeleteOpen(false)}
            >
              <p>Bạn có chắc chắn muốn xóa tài khoản?</p>
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
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
